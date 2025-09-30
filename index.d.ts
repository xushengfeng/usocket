import { Duplex, DuplexOptions } from "stream";
import { EventEmitter } from "events";

export interface USocketOptions {
	fd?: number;
	path?: string;
	allowHalfOpen?: boolean;
}

export interface USocketWriteChunk {
	data?: Buffer;
	fds?: number[];
	callback?: (chunk: USocketWriteChunk) => void;
}

export type USocketReadResult =
	| Buffer
	| { data: Buffer | null; fds: number[] }
	| null;

export class USocket extends Duplex {
	fd?: number;
	constructor(opts?: USocketOptions | string, cb?: () => void);
	connect(opts: USocketOptions | string, cb?: () => void): void;
	read(size?: number): Buffer | null;
	// 重载2：读数据和文件描述符
	read(
		size: number | undefined,
		fdSize: number | null,
	): { data: Buffer | null; fds: number[] } | null;
	unshift(chunk: Buffer, fds?: number[]): void;
	write(
		chunk: string | Buffer | USocketWriteChunk | number[],
		callback?: (err?: Error) => void,
	): boolean;
	write(
		chunk: string | Buffer | USocketWriteChunk | number[],
		encoding?: string | null,
		callback?: (err?: Error) => void,
	): boolean;
	end(data?: string | Buffer, encoding?: string, callback?: () => void): void;
	destroy(): void;
	maybeClose(): void;
}

export class UServer extends EventEmitter {
	fd?: number;
	listening: boolean;
	paused: boolean;
	constructor();
	listen(path: string, backlog?: number, cb?: () => void): void;
	listen(path: { path: string; backlog?: number }, cb?: () => void): void;
	listen(path: string, cb?: () => void): void;
	pause(): void;
	resume(): void;
	close(): void;
	/**
	 * 监听 connection 事件，回调参数为 USocket 实例。
	 */
	on(event: "connection", listener: (socket: USocket) => void): this;
	/**
	 * 监听其他事件（如 error、listening 等）。
	 */
	on(event: string, listener: (...args: any[]) => void): this;
}
