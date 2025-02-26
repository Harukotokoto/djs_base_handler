import { BackgroundColor, LogColor } from '@/libraries/Enums/LogColors';

export class Logger {
    public constructor(private readonly timeFormat = 'YYYY/MM/DD HH:mm:ss') {}

    public info(message: string): void {
        console.log(
            `${LogColor.Green}[ ${LogColor.Blue}INFO ${LogColor.Green}]  ${LogColor.Magenta}${this.getTimestamp()} ${LogColor.Yellow}| ${LogColor.Reset}${message}`,
        );
    }

    public error<T>(message: T): void {
        console.log(
            `${LogColor.Green}[ ${LogColor.Red}ERROR ${LogColor.Green}] ${LogColor.Magenta}${this.getTimestamp()} ${LogColor.Yellow}| ${LogColor.Red}${message}${LogColor.Reset}`,
        );
    }

    public debug(message: string): void {
        console.log(
            `${BackgroundColor.Magenta}${LogColor.Green}[ ${LogColor.Red}DEBUG ${LogColor.Green}] ${LogColor.Red}${this.getTimestamp()} ${LogColor.Yellow}| ${LogColor.Red}${message}${LogColor.Reset}${BackgroundColor.Default}`,
        );
    }

    private getTimestamp(format = this.timeFormat) {
        const time = new Date();

        const replaceTokens: {
            [key: string]: string;
        } = {
            YYYY: time.getFullYear().toString(),
            MM: (time.getMonth() + 1).toString().padStart(2, '0'),
            DD: time.getDate().toString().padStart(2, '0'),
            HH: time.getHours().toString().padStart(2, '0'),
            mm: time.getMinutes().toString().padStart(2, '0'),
            ss: time.getSeconds().toString().padStart(2, '0'),
        };

        return format.replace(
            /YYYY|MM|DD|HH|mm|ss/g,
            (match) => replaceTokens[match] || match,
        );
    }
}
