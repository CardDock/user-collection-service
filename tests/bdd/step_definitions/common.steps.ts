import { When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import { getAppHttpServer, CustomWorld } from './hooks';

function resolvePath(obj: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce((acc: unknown, segment: string) => {
      if (acc === undefined || acc === null) return undefined;
      const match = segment.match(/^(\w+)\[(\d+)\]$/);
      if (match) {
        const [, key, index] = match;
        const arr = (acc as Record<string, unknown>)[key];
        if (Array.isArray(arr)) return arr[Number(index)];
        return undefined;
      }
      return (acc as Record<string, unknown>)[segment];
    }, obj);
}

When('I send a GET request to {string}', async function (this: CustomWorld, path: string) {
  this.response = await request(getAppHttpServer()).get(path);
});

When('I send a POST request to {string} with body:', async function (this: CustomWorld, path: string, body: string) {
  this.response = await request(getAppHttpServer())
    .post(path)
    .send(JSON.parse(body))
    .set('Content-Type', 'application/json');
});

When('I send a PATCH request to {string} with body:', async function (this: CustomWorld, path: string, body: string) {
  this.response = await request(getAppHttpServer())
    .patch(path)
    .send(JSON.parse(body))
    .set('Content-Type', 'application/json');
});

When('I send a DELETE request to {string}', async function (this: CustomWorld, path: string) {
  this.response = await request(getAppHttpServer()).delete(path);
});

Then('the response status should be {int}', async function (this: CustomWorld, status: number) {
  if (!this.response) throw new Error('No response received');
  if (this.response.status !== status) {
    throw new Error(
      `Expected status ${status} but got ${this.response.status}. Body: ${JSON.stringify(this.response.body)}`,
    );
  }
});

Then('the response body should contain a {string} field', async function (this: CustomWorld, field: string) {
  if (!this.response) throw new Error('No response received');
  if (this.response.body[field] === undefined) {
    throw new Error(
      `Expected response body to have field "${field}" but got ${JSON.stringify(this.response.body)}`,
    );
  }
});

Then('the response body should have property {string} with value {string}', async function (this: CustomWorld, path: string, value: string) {
  if (!this.response) throw new Error('No response received');
  const actual = resolvePath(this.response.body, path);
  if (actual === undefined || actual === null) {
    throw new Error(`Property "${path}" not found in response body: ${JSON.stringify(this.response.body)}`);
  }
  if (String(actual) !== value) {
    throw new Error(`Expected "${path}" to be "${value}" but got "${actual}"`);
  }
});

Then('the response body should have property {string} with number {float}', async function (this: CustomWorld, path: string, value: number) {
  if (!this.response) throw new Error('No response received');
  const actual = resolvePath(this.response.body, path);
  if (actual === undefined || actual === null) {
    throw new Error(`Property "${path}" not found in response body: ${JSON.stringify(this.response.body)}`);
  }
  if (actual !== value) {
    throw new Error(`Expected "${path}" to be ${value} but got ${actual}`);
  }
});

Then('the response should have an error message', async function (this: CustomWorld) {
  if (!this.response) throw new Error('No response received');
  if (!this.response.body.message) {
    throw new Error(`Expected error message in body: ${JSON.stringify(this.response.body)}`);
  }
});

Then('the response body should be empty', async function (this: CustomWorld) {
  if (!this.response) throw new Error('No response received');
  const body = this.response.body;
  if (body && (typeof body === 'object') && Object.keys(body).length > 0) {
    throw new Error(`Expected empty body but got: ${JSON.stringify(body)}`);
  }
});
