import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Game, GameReport } from '../../lib/Game'
import { Choice } from 'src/lib/Player'

const timelimit = parseInt(process.env.GAME_TIMELIMIT || '180000')

type PlayerProps = {
  nickname: string | null
  rating: number | null
  out_id: [string]
}
interface CreateGameProps {
  player1: PlayerProps
  player2: PlayerProps
}

@Injectable()
export class GameService {
  games: { [playerId: string]: Game } = {}

  createGame({ player1, player2 }: CreateGameProps) {
    const game = new Game({
      player1: {
        nickname: player1.nickname,
        rating: player1.rating,
        out_id: player1.out_id,
      },
      player2: {
        nickname: player2.nickname,
        rating: player2.rating,
        out_id: player2.out_id,
      },
      timelimit,
    })

    this.games[player1.out_id[0]] = this.games[player2.out_id[0]] = game

    game.start()
  }

  getGameState(playerId: string): GameReport | null {
    const game = this.games[playerId]
    if (!game) return null

    return game.getStateReport(playerId)
  }

  setChoice(playerId: string, choice: Choice) {
    const game = this.games[playerId]
    if (!game) throw new NotFoundException()

    game.setChoice(playerId, choice)
  }

  forfeit(playerId: string) {
    const game = this.games[playerId]
    if (!game) return null

    game.forfeit(playerId)
  }

  pushMessage(playerId: string, message: string) {
    const game = this.games[playerId]
    if (!game) throw new BadRequestException('invalid playerId')

    game.pushMessage(playerId, message)
  }
}
