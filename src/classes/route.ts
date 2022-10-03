import { Request, Response } from 'express';

export abstract class Route {
  constructor(protected readonly request: Request, protected readonly response: Response) {}
}