const assert = require("node:assert/strict");
const sinon = require("./sinon");
const Service = require("./service");

const BASE_URL_1 = "https://swapi.dev/api/planets/1/";
const BASE_URL_2 = "https://swapi.dev/api/planets/2/";

const json_mocks = {
  alderaan: require("../mock/alderaan.json"),
  tatooine: require("../mock/tatooine.json"),
};

(async () => {
  const service = new Service();
  const stub = sinon.stub(service, service.makeRequest.name);

  stub.withArgs(BASE_URL_1).resolves(json_mocks.tatooine);
  stub.withArgs(BASE_URL_2).resolves(json_mocks.alderaan);

  //   {
  //     const service = new Service();
  //     const response = await service.makeRequest(BASE_URL_1);
  //     console.log(response);
  //   }

  {
    const expected = {
      name: "Tatooine",
      surfaceWater: "1",
      appeardIn: 5,
    };

    const results = await service.getPlanets(BASE_URL_1);
    assert.deepStrictEqual(results, expected);
  }

  {
    const expected = {
      name: "Alderaan",
      surfaceWater: "40",
      appeardIn: 2,
    };

    const results = await service.getPlanets(BASE_URL_2);
    assert.deepStrictEqual(results, expected);
  }
})();
