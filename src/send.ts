import { NotificationClient } from '@caasxyz/notification-sdk';
import * as core from '@actions/core';
import fs from 'fs';

class NotificationService {
    private subject: string;
    private api_key: string;
    private user_id: string;

    constructor(subject: string, api_key: string, user_id: string) {
        this.subject = subject;
        this.api_key = api_key;
        this.user_id = user_id;
    }

    public set_subject(subject: string) {
        this.subject = subject;
    }

    public async send_content(content: string) {
        console.log(`${this.subject} ${content}`)

        // Initialize the client
        const client = new NotificationClient({
            baseUrl: "https://notification.caas.xyz",
            apiKey: this.api_key,
        });

        // Send a notification
        const response = await client.sendNotification({
            user_id: this.user_id,
            channels: ['lark'],
            custom_content: {
                subject: this.subject,
                content
            },
            idempotency_key: `mpc-${Date.now()}`,
        });

        if (!response.success) {
            console.error("send_lark error");
            console.error(response.error);
        }
    }
}

async function main() {
    const user_id = core.getInput('user-id', { required: true });
    const api_key = core.getInput('api-key', { required: true });
    let content = core.getInput('content');
    const failure = core.getInput('failure');

    console.log(content)
    console.log(failure)

    let github_repo = `https://github.com/${process.env.GITHUB_REPOSITORY}`;
    let service = new NotificationService(`${github_repo} 打包`, api_key, user_id);

    if (failure) {
        let build_log_path = `${process.cwd()}/build.log`;
        if (fs.existsSync(build_log_path)) {
            let build_log = fs.readFileSync(build_log_path).toString();
            content = `失败 \n ${build_log}`;
        }
    }
    
    await service.send_content(content);
}

main();