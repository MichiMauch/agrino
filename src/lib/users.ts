const users = [
    { id: 1, name: 'Lars' },
    { id: 2, name: 'Michi' }
  ];
  
  export function getUserById(id: number) {
    return users.find(user => user.id === id);
  }
  
  export default users;
  