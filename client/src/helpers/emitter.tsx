import { EventEmitter } from "events";

const em = new EventEmitter()

em.removeAllListeners()

export const globalEmitter = em