import swaggerAutogen from "swagger-autogen";

const outputFile = './constants/swagger_output.json';
const endpointsFiles = [
  './routes/Comment.routes.ts',
  './routes/Post.routes.ts'
];

swaggerAutogen(outputFile, endpointsFiles);
