require('dotenv').config();
require('../../lib/utils/connect')();
const request = require('supertest');
const User = require('../../lib/models/User');
const app = require('../../lib/app');
const mongoose = require('mongoose');

describe('auth', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('can signup a new user', () => {
    return request(app)
      .post('/auth/signup')
      .send({ email: 'banana@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          user: {
            email: 'banana@test.com',
            _id: expect.any(String)
          },
          token: expect.any(String)
        });
      });
  });

  it('can signin a user', () => {
    return User.create({ email: 'what@huh.com', password: 'pass' })
      .then(user => {
        return request(app)
          .post('/auth/signin')
          .send({ email: 'what@huh.com', password: 'pass' })
          .then(res => {
            expect(res.body).toEqual({
              user: {
                email: 'what@huh.com',
                _id: user._id.toString()
              },
              token: expect.any(String)
            });
          });
      });
  });

  it('can throw an error if at bad signin', () => {
    return User.create({ email: 'banana@huh.com', password: 'pass' })
      .then(() => {
        return request(app)
          .post('/auth/signin')
          .send({ email: 'banana@huh.com', password: 'p3ss' })
          .then(res => {
            console.log(res.status);
          });
      });
  });
  
  afterAll((done) => {
    mongoose.disconnect(done);
  }); 
});
