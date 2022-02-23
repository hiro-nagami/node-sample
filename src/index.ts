import { listen } from 'controller/api'

const port = process.env.PORT || "3000"

listen(port)