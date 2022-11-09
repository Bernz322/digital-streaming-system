import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Movies} from '.';
import {User} from './user.model';

@model()
export class Reviews extends Entity {
  @property({
    type: 'string',
    id: true,
    mongodb: {dataType: 'ObjectID'},
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'number',
    required: true,
  })
  rating: number;

  @property({
    type: 'date',
    required: true,
    default: new Date(),
  })
  datePosted: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isApproved: boolean;

  @belongsTo(() => Movies, {name: 'movieReviews'})
  movieId: string;

  @belongsTo(() => User, {name: 'userReviewer'})
  userId: string;

  constructor(data?: Partial<Reviews>) {
    super(data);
  }
}

export type ReviewsWithRelations = Reviews;
