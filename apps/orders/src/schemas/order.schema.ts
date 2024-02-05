import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Order extends AbstractDocument {
  @Prop({ unique: true, required: true, type: String })
  name: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
