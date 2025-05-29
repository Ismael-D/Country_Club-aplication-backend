import { members } from '../database/fakeData.js'

const create = async ({ name, lastName, dni, email, telephone, payDay, debt = 0, status = "no_debt" }) => {
  if (status === "in_debt" && debt === 0) {
    throw new Error("Debt must be greater than 0 if status is in_debt")
  }
  if (status === "no_debt" && debt !== 0) {
    throw new Error("Debt must be 0 if status is no_debt")
  }
  const newMember = {
    id: (members.length + 1).toString(),
    name,
    lastName,
    dni,
    email,
    telephone,
    payDay,
    debt,
    status
  }
  members.push(newMember)
  return newMember
}

const findAll = async () => members

const findOneById = async (id) => members.find(m => m.id === id)

const update = async (id, data) => {
  const member = members.find(m => m.id === id)
  if (!member) return null


  if (data.status === "in_debt" && data.debt === 0) {
    throw new Error("Debt must be greater than 0 if status is in_debt")
  }
  if (data.status === "no_debt" && data.debt !== 0) {
    throw new Error("Debt must be 0 if status is no_debt")
  }

  Object.assign(member, data)
  return member
}

const remove = async (id) => {
  const index = members.findIndex(member => member.id === Number(id))
  if (index === -1) return false
  members.splice(index, 1)
  return true
}

export const MemberModel = {
  create,
  findAll,
  findOneById,
  update,
  remove
}