import { initApp } from './src/app.js';

const PORT = 3000;
const app = initApp();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});