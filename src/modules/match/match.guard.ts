import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { PlayerEmitType, PlayerSocket } from './types/PlayerSocket'
import { MatchService } from './match.service'
import { firebaseAuth } from '@/firebase/services'
import { SocketPlayerChannel } from './lib/PlayerChannel'
import { SocketsService } from '../sockets.service'

@Injectable()
export class MatchGuard implements CanActivate {
  constructor(
    private matchService: MatchService,
    private socketsService: SocketsService<PlayerEmitType>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const socket = context.switchToWs().getClient<PlayerSocket>()
    const { token, matchId } = socket.handshake.auth

    if (socket.data.player && socket.data.match) return true

    const match = this.matchService.getMatch(matchId)
    if (!match) {
      console.error(`Bad match id: ${matchId}`)
      return false
    }

    try {
      const authData = await firebaseAuth.verifyIdToken(token)

      const player = match.playerMap[authData.uid]
      if (!player) {
        console.error(`Bad player uid: ${authData.uid}`)
        return false
      }

      socket.data.match = match
      socket.data.player = player
      this.socketsService.add(authData.uid, socket)
      player.channel = new SocketPlayerChannel(player, this.socketsService)
      console.log(`${player.profile.name} connected to the game.`)
      return true
    } catch (e) {
      console.error(e.message)
      return false
    }
  }
}
