export default class UserDto {
    constructor(user) {
      this.firstName = user.first_name;
      this.lastName = user.last_name;
      this.email = user.email;
      this.age = user.age;
      this.password = user.password;
      this.role = user.role;
    }
  };