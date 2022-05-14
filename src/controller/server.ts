import app, { httpServer } from "controller/api"

const server = async() => new Promise((resolve, reject) => {
    httpServer.listen(process.env.PORT || "3000").once('listening', resolve).once('error', reject)
}).then(() => {
    return app;
})

export default server;