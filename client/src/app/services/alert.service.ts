import { Injectable, signal, WritableSignal } from "@angular/core";

type MsgType = {
   message: string;
   id?: string;
   type?: "success" | "warning" | "error";
   autoDismiss?: boolean;
};

@Injectable({
   providedIn: "root",
})
export class AlertService {
   messages: WritableSignal<MsgType[]> = signal([]);

   add(msg: MsgType) {
      msg.type = msg.type || "success";
      msg.id = msg.id || globalThis.crypto.randomUUID();
      msg.autoDismiss = msg.autoDismiss ?? true;

      this.messages.update((prev) => [...prev, msg]);
      //removing after 5sec
      if (msg.autoDismiss) {
         setTimeout(() => {
            this.close(msg.id);
         }, 2000);
      }
   }

   close(id: MsgType["id"]) {
      this.messages.update((prev) => prev.filter((v) => v.id != id));
   }

   closeAll() {
      this.messages.set([]);
   }
}
