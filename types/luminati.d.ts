import { EventEmitter } from "events";

export interface ILuminatiServerOptions {
  /** Proxy port to listen on */
  port?: number | null;

  /** Luminati customer */
  customer: string;

  /** Zone password */
  password: string;

  /** Zone */
  zone: string;

  /** ASN */
  asn?: string | null;

  /** City */
  city?: string | null;

  /** Country */
  country?: string | null;

  /** Luminati request debug info */
  debug?: "full" | "none" | null;

  /** DNS resolving */
  dns?: "local" | "remote" | null;

  /** A list of proxies from external vendors. Format: [username:password@]ip[:port] */
  ext_proxies?: string[] | null;

  /** default password for external vendor ips */
  ext_proxy_password?: string | null;

  /** default port for external vendor ips */
  ext_proxy_port?: number | null;

  /** default username for external vendor ips */
  ext_proxy_username?: string | null;

  /** Request headers */
  headers?: { name: string | null; value: string }[] | null;

  /** Interface or IP to listen on */
  iface?: string | null;

  /** Keep alive duration, defaults to 1h */
  idle_pool?: boolean | null;

  /** Data center IP */
  ip?: string | null;

  /** Log level */
  log?: string | "error" | "warn" | "notice" | "info" | "debug" | null;

  /** Maximum requests per session */
  max_requests?: number | null;

  /** Multiply the port definition given number of times */
  multiply?: number | null;
  multiply_ips?: boolean | null;
  multiply_vips?: boolean | null;
  multiply_users?: boolean | null;

  /** If set to true, skips usage statistics */
  no_usage_stats?: boolean | null;

  /** Operating System of the Peer IP */
  os?: string | null;

  /** Override headers */
  override_headers?: boolean | null;

  /** Session pool size */
  pool_size?: number | null;

  /** Hostname or IP of super proxy */
  proxy?: string | null;

  /** Determines what kind of connection will be used between LPM and Super Proxy */
  proxy_connection_type?: "http" | "https" | "socks" | null;

  /** Super proxy port */
  proxy_port?: number | null;

  /** Automatically retry on super proxy failure */
  proxy_retry?: number | null;

  /**
   * Decide if to save proxy into the configuration file. Specifying "persist" in "proxy_type"
   * value will create port and save it in the configuration file.
   */
  proxy_type?: string | null;

  /** Race several requests at once and choose fastest */
  race_reqs?: number | null;

  /** Process reverse lookup via DNS */
  reverse_lookup_dns?: boolean | null;

  /** Process reverse lookup via file */
  reverse_lookup_file?: string | null;

  /** Process reverse lookup via value */
  reverse_lookup_values?: string[] | null;

  /** Enable saving statistics to database */
  request_stats?: boolean | null;

  /** Luminati session for all proxy requests */
  session?: string | null;

  /** Maximum duration of session (seconds) */
  session_duration?: number | null;

  /** How long can a socket be inactive before it should be closed (default 120s) */
  socket_inactivity_timeout?: number | null;

  /** SMPT config for rules */
  smtp?: string[] | null;

  /** Enable SSL analyzing */
  ssl?: boolean | null;

  /** State */
  state?: string | null;

  /** Use session per requesting host to maintain IP per host */
  sticky_ip?: boolean | null;

  /** Throttle requests above given number */
  throttle?: number | null;

  /** List of users. This option has to be used along with "multiply_users" */
  users?: string[] | null;

  /** gIP, can be a number (legacy) or string */
  vip?: string | number | null;

  /**
   * Default access grant for this port. Only these IPs will be able to send
   * requests to this port. 127.0.0.1 is always allowed to send requests.
   */
  whitelist_ips?: string[] | null;
}

export interface IUsageStartData {
  uuid: string;
  port: number;
  url: string;
  method: string;
  headers: { [k: string]: string };
  timestamp: number;
  context: any;
}

export interface IUsageData {
  uuid: string;
  port: number;
  url: string;
  method: string;
  request_headers: string;
  request_body: string;
  response_headers: string;
  response_body: string;
  status_code: string;
  status_message: string;
  timestamp: number;
  elapsed: number;
  response_time: number;
  proxy_peer: string;
  country: string;
  timeline: string;
  content_size: number;
  context: any;
  remote_address: string;
  rules: any;
  in_bw: number;
  out_bw: number;
  super_proxy?: string;
  username?: string;
  password?: string;
  success?: boolean;
}

export interface IServerEventObj {
  error: any;
  tls_error: any;
  send_rule_email: { port: number; email: string; url: string };
  idle: boolean;
  access_denied: string;
  ready: undefined;
  stopped: undefined;
  first_lpm_action: {
    action: "send_request" | "send_request_successful";
    ua: string;
  };
  response: any;
  usage_start: IUsageStartData;
  usage: IUsageData;
  usage_abort: IUsageData;
  refresh_ip: { ip: string; port: number };
  banip: { ip: string; ms: number; domain: string };
  unbanip: { ip: string; domain: string };
}

/**
 * Manage and start luminati proxy servers
 */
declare class Server extends EventEmitter {
  constructor(options: ILuminatiServerOptions);

  /**
   * Updates the configuration of a running server
   *
   * @param options Options to overwrite
   */
  update_config(options: Partial<ILuminatiServerOptions>): void;

  /**
   * Starts the server
   *
   * @param listenPort Port to listen on, defaults to `options.port`
   * @param hostname Hostname/interface to listen on, defaults to `options.iface`
   */
  listen(listenPort?: number, hostname?: string): Promise<void>;

  /**
   * Stops a running server
   */
  stop(): Promise<void>;

  on<K extends keyof IServerEventObj>(
    eventName: K,
    handler: (e: IServerEventObj[K], ...args: any[]) => void
  ): this;

  once<K extends keyof IServerEventObj>(
    eventName: K,
    handler: (e: IServerEventObj[K], ...args: any[]) => void
  ): this;
}

export default Server;
