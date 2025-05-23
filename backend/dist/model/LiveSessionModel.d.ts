import { Document, Model, Types } from "mongoose";
import { ILiveSession } from "../../shared/interface/LiveSessionInterface";
export interface ILiveSessionDocument extends Omit<ILiveSession, '_id' | "sessionId">, Document {
    sessionId: Types.ObjectId;
}
export declare const LiveSessionModel: Model<ILiveSessionDocument>;
//# sourceMappingURL=LiveSessionModel.d.ts.map