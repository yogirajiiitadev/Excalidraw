import {z} from 'zod';

export const CreateUserSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(3).max(20),
    name: z.string().min(3).max(20),
});

export const CreateSignInSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string(),
});

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20),
    description: z.string().min(10).max(200),
});

const SingleShapeSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("rect").describe("The shape is a rectangle."),
    x: z.number().describe("The x-coordinate of the top-left corner of the rectangle."),
    y: z.number().describe("The y-coordinate of the top-left corner of the rectangle."),
    width: z.number().describe("The width of the rectangle."),
    height: z.number().describe("The height of the rectangle.")
  }),
  z.object({
    type: z.literal("circle").describe("The shape is a circle."),
    centerX: z.number().describe("The x-coordinate of the circle's center."),
    centerY: z.number().describe("The y-coordinate of the circle's center."),
    radius: z.number().describe("The radius of the circle.")
  }),
  z.object({
    type: z.literal("pencil").describe("The shape is a simple Arrow."),
    startX: z.number().describe("The x-coordinate where the arrow starts."),
    startY: z.number().describe("The y-coordinate where the arrow starts."),
    endX: z.number().describe("The x-coordinate where the arrow ends."),
    endY: z.number().describe("The y-coordinate where the arrow ends.")
  }),
  z.object({
    type: z.literal("text").describe("The shape is a text annotation."),
    startX: z.number().describe("The x-coordinate where the text begins."),
    startY: z.number().describe("The y-coordinate where the text begins."),
    font: z.string().describe("The font style used for the text (e.g., 'Arial 12px')."),
    color: z.string().describe("The color of the text (CSS color format)."),
    inputText: z.string().describe("The actual text content to be rendered.")
  })
]);
export const ShapeSchema = z.array(SingleShapeSchema);

