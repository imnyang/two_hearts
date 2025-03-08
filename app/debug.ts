import chokidar from 'chokidar';
import { exec } from 'child_process';

// 워치할 디렉터리 설정
const watcher = chokidar.watch('./src', { ignored: /^\./, persistent: true });

watcher.on('change', (path) => {
    console.log(`${path} has been changed`);

    // 변경 시 build 명령어 실행
    exec('bun run build', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    });
});
