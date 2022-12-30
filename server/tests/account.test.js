const request = require("supertest");
const server = require("../server");

let token = undefined;
let refreshToken = undefined;
let headers = undefined;

describe("Signin", () => {
  it("should ping the server", async () => {
    const res =await request(server)
      .get("/")
      .expect(200);
    expect(res.text).toBe('Litentry Task Server');
  });
  it('should not sign in with invalid payload', async () => {
    var payload = {};
    const res = await request(server)
      .post('/api/v1/signin')
      .send(payload)
      .set('Accept', 'application/json')
      .expect(401);
  });
  it("should sign in with valid payload", async () => {
    var payload = {
      "address": "14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo",
	    "message": "Sign-in request for address 14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo.",
	    "signature": "0xfc03197bd2110f613677913e3d52afbc1ecda9099109f01300a97acde7122d305d87d115cf173632319c6666d829a4585a45462cb3d2df5513f7d5a68c9f1785"
    };
    const res = await request(server)
      .post('/api/v1/signin')
      .send(payload)
      .set('Accept', 'application/json')
      .expect(200);

    token = res.body.token;
    headers = res.headers['set-cookie']
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
  it('should not refresh with invalid refresh token', async () => {
    const res = await request(server)
      .post('/api/v1/refreshtoken')
      .set('Accept', 'application/json')
      .set("Cookie", [])
      .expect(401);
  })
  it('should refresh token with valid refresh token', async () => {
    const res = await request(server)
      .post('/api/v1/refreshtoken')
      .set('Accept', 'application/json')
      .set("Cookie", headers)
      .expect(200);

    token = res.body.token;
    headers = res.headers['set-cookie']
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
});

describe('Secret', () => {
  it('should not get secret with invalid token', async () => {
    const res = await request(server)
    .get('/api/v1/secret')
    .set('Accept', 'application/json')
    .set('Authorization', 'bearer benzona')
    .expect(401);
  })
  it('should get secret with valid token', async () => {
    const res = await request(server)
      .get('/api/v1/secret')
      .set('Accept', 'application/json')
      .set('Authorization', 'bearer ' + token)
      .expect(200);
    expect(res.body.secret).toBe('Messi is the GOAT');
  })
});

describe('Signout', () => {
  it('should clear cookie', async () => {
    const res = await request(server)
      .post('/api/v1/signout')
      .set('Accept', 'application/json')
      .set('Authorization', 'bearer ' + token).set("Cookie", headers)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.headers['set-cookie'].length).toBe(1);
  })
})