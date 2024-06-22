const users = [
  { id: 1, name: 'Lars Mauch', email: 'skoelliker@gmail.com' },
  { id: 2, name: 'Michi Mauch', email: 'michi.mauch@gmail.com' }
];

export function getUserById(id: number) {
  return users.find(user => user.id === id);
}

export default users;
