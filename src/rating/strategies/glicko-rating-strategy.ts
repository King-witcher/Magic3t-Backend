import { Glicko, UserModel } from '@/database/users/user.model'
import { RatingStrategy } from './base-rating-strategy'
import { ConfigService } from '@/database/config/config.service'
import { Injectable } from '@nestjs/common'
import { getInflation, newDeviation, newRating } from '../lib/glicko'

@Injectable()
export class GlickoRatingStrategy extends RatingStrategy {
  constructor(private readonly configService: ConfigService) {
    super()
  }

  async getRatings(
    first: UserModel,
    second: UserModel,
    scoreOfFirst: number,
  ): Promise<[Glicko, Glicko]> {
    const config = await this.configService.getRatingConfig()

    const inflation = getInflation(
      config.deviationInflationTime,
      config.initialRD,
    )

    const now = new Date()

    return [
      {
        rating: newRating(
          first.glicko,
          second.glicko,
          scoreOfFirst,
          inflation,
          config.initialRD,
        ),
        deviation: newDeviation(
          first.glicko,
          second.glicko,
          inflation,
          config.initialRD,
        ),
        timestamp: now,
      },
      {
        rating: newRating(
          second.glicko,
          first.glicko,
          1 - scoreOfFirst,
          inflation,
          config.initialRD,
        ),
        deviation: newDeviation(
          second.glicko,
          first.glicko,
          inflation,
          config.initialRD,
        ),
        timestamp: now,
      },
    ]
  }
}
