# gce-ips

fetch a list of Google Compute Engine IPs using DNS lookup

```sh
gce-ips list --format=json
gce-ips check 104.196.27.39
```

## Installation

`npm i gce-ips -g`

## Usage

* `list`: return a list of GCE IPs in JSON or text format.
* `check`: check whether an IP is GCE:
  * `$?` = `0` if IP is in range.
  * `$?` = `1` if IP is out of range.

## License

ISC
