import { Injectable } from '@nestjs/common';

@Injectable()
export class FirstRouteService {
  getHello(): any {
    let test:any [] = [
      {
        chan1: "toto",
        type: "vrac"
      }
    ]
    return test;
  }
}
