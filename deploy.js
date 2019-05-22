const {execSync} = require("child_process");
const fs = require("fs");

class Deploy {
    constructor(branch) {
        this.AWS_REGION = 'ap-northeast-2';
        this.AWS_ACCESS_KEY_ID = 'AKIAJRZFAUMPPHRJRPUQ';
        this.AWS_SECRET_ACCESS_KEY = '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';
        this.AWS_BEANSTALK_APP_NAME = 'new-porsche';
        this.AWS_BEANSTALK_ENV_NAME = 'revu-develop';
        this.BRANCH = 'develop';
        if (branch === 'master') {
            this.BRANCH = 'master';
            this.AWS_BEANSTALK_ENV_NAME = 'revu-master';
        }

        this.GIT_REV = execSync('git rev-parse HEAD').toString().replace("\n", "");
        this.VERSION = `${this.BRANCH}-${this.GIT_REV}`;
        this.ZIP_FILENAME = `new-porsche-${this.VERSION}.zip`;
        this.S3 = 'www.weble.net';

        process.env.AWS_ACCESS_KEY_ID = this.AWS_ACCESS_KEY_ID;
        process.env.AWS_SECRET_ACCESS_KEY = this.AWS_SECRET_ACCESS_KEY;
    }

    static _log(str) {
        console.log(`${str}`);
    }

    installPackage() {
        Deploy._log('🔨 Install required Package');
        execSync('curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -');
        execSync('sudo apt-get update && sudo apt-get install -y nodejs zip python3-dev python3-pip');
        execSync('pip3 install awscli --upgrade --user');
    };

    installNPM() {
        Deploy._log('🎁 NPM install & Build');
        execSync('npm install --no-progress');
        execSync(`npm run build:ssr:${this.BRANCH}`);
    }

    beanstalk() {
        try {
            Deploy._log('🥜 :: Upload build files to S3');
            execSync(`mv deploy.zip ${this.ZIP_FILENAME}`);
            execSync(`~/.local/bin/aws s3 cp ${this.ZIP_FILENAME} s3://${this.S3}/new-build/`);
            Deploy._log('🥜 :: Create new version');
            execSync(`~/.local/bin/aws elasticbeanstalk create-application-version --application-name ${this.AWS_BEANSTALK_APP_NAME} --version-label "${this.VERSION}" --description "$(git log -1 --pretty=%B)" --source-bundle S3Bucket="${this.S3}",S3Key="new-build/${this.ZIP_FILENAME}" --region ${this.AWS_REGION}`);
            Deploy._log('🥜 :: Apply new version to instances');
            execSync(`~/.local/bin/aws elasticbeanstalk update-environment --application-name ${this.AWS_BEANSTALK_APP_NAME} --environment-name ${this.AWS_BEANSTALK_ENV_NAME} --version-label ${this.VERSION} --region ${this.AWS_REGION}`);
        } catch (e) {
            throw e;
        } finally {
            execSync(`rm ${this.ZIP_FILENAME}`);
        }
    }

    run() {
        Deploy._log(`🔥 Start new porsche deploy :: ${this.BRANCH} 🔥`);
        this.installPackage();
        this.installNPM();
        this.makeZip();
        this.beanstalk();
        Deploy._log('🍺 Finish new porsche deploy 🍺');

        // todo
        //  scss bootstrap
    }

    makeZip() {
        Deploy._log('🎁 Make zip via gulp-zip');
        execSync('./node_modules/.bin/gulp zip');
    }
}

let branch = process.argv[process.argv.length - 1];
let deploy = new Deploy(branch);
deploy.run();
