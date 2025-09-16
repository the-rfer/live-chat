import bcrypt from 'bcryptjs';

export default async function register(username, email, password) {
    //1. verify email and username are unique, else return error
    //2. hash password, create new user and save it
}
