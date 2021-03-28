import { Request, Response, Router } from "express";

import rabbit from "../broker/rabbitmq";

class Routes {
  public router: Router = Router();

  constructor() {
    this.setRoutes();
  }

  private setRoutes(): void {
    this.router.post("/express", async (req: Request, res: Response) => {
      try {
        await rabbit.publishInQueue(JSON.stringify(req.body));

        await rabbit.publishInExchange(
          "amq.direct",
          "rota",
          JSON.stringify(req.body)
        );

        res.status(200).send(req.body);
      } catch (error) {
        res.status(500).send(error);
      }
    });
  }
}

export default new Routes().router;
