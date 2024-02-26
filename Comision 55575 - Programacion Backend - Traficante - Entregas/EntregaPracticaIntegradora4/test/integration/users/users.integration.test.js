import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Pruebas de integración módulo Users', () => {
    //vamos a trabajar con cookies:
    let cookie;

    it('Debemos registrar un usuario correctamente', async () => {
        // creamos un usario de prueba:
        const userMock = {
            first_name: 'Usuario',
            last_name: 'Test',
            email: 'test123@test.test',
            age: 100,
            password: '1234',
            role: 'USER',
        };

        const { statusCode } = await requester.post('/api/users/register').send(userMock);
        expect(statusCode).to.be.eql(201);
    });

    it('Debemos loguear al usuario y retornar una cookie', async () => {
        const credentialsMock = {
            email: 'test123@test.test',
            password: '1234'
        };

        const loginResult = await requester.post('/api/users/login').send(credentialsMock);
        // las cookies se envian dentro de los headers sea para el req o para el res:
        const cookieResult = loginResult.headers['set-cookie'][0]; // atributo "set-cookie" valor por default del header;
        // [0] es la posicion del elemento
        // 'coderCookie=asdhfasdfashjdfgasjdf' --> eso es lo que deberiamos tener almacenado
        expect(cookieResult).to.be.ok;

        const cookieResultSplit = cookieResult.split('='); // vamos a dividir la cookie del JWT propiamente dicho (separados por el =)
        // ['coderCookie', 'asdhfasdfashjdfgasjdf']; cookie + jwt

        cookie = {
            name: cookieResultSplit[0], // aca se encuentra el nombre
            value: cookieResultSplit[1] // aca se encuentra el valor
        }

        expect(cookie.name).to.be.ok.and.eql('coderCookieToken'); // que la cookie exista y que el nombre sea = coderCookie
        expect(cookie.value).to.be.ok;
    });
})