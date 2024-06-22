const users = [
  { id: 1, name: 'Lars', email: 'skoelliker@gmail.com' },
  { id: 2, name: 'Michi', email: 'michi.mauch@gmail.com' }
];

export function getUserById(id: number) {
  return users.find(user => user.id === id);
}

export default users;
