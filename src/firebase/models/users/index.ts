import { database } from '@/firebase/services'
import { getConverter } from '../getConverter'
import { Glicko, User } from './User'
import { NotFoundError } from '../errors/NotFoundError'

const converter = getConverter<User>()
const collection = database.collection('users').withConverter(converter)

async function getById(id: string): Promise<User> {
  const doc = await collection.doc(id).get()
  const data = doc.data()

  if (!data) throw new NotFoundError('users', id)

  return data
}

async function updateGlicko(id: string, glicko: Glicko) {
  await collection.doc(id).update({
    glicko: glicko,
  })
}

export const users = { collection, getById, updateGlicko }
