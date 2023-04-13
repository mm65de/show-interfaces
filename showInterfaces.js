// This program implements an http server 
// that returns an html table describing the network interfaces.

const { networkInterfaces, hostname } = require('os');  // See: https://nodejs.org/api/os.html
const interfaces = networkInterfaces();

// Return an array containing all interface names.
// Sample:
//     Input:   {"lo":[{"address":"127.0.0.1","netmask":"255.0.0.0"}],"eth0":[{"family":"IPv4"}]}
//     Output:  ["lo","eth0"]
function interfaceNames(interfaces) {
    return Object.keys(interfaces);
}

// Return an array containing all attribute names of the passed interfaces.
// Sample:
//     Input:   {"lo":[{"address":"127.0.0.1","netmask":"255.0.0.0"}],"eth0":[{"family":"IPv4"}]}
//     Output:  ["address","netmask","family"]
function interfaceAttributes(interfaces) {
    const attributes = [];
    for (const itfName of Object.keys(interfaces)) {
        for (const itf of interfaces[itfName]) {
            for (const attrName of Object.keys(itf)) {
            if (!attributes.includes(attrName)) {
                    attributes.push(attrName);
                }
            }
        }
    }
    return attributes;
}

// Return an array containing all hosts of the passed interfaces.
// Sample:
//     Input:   {"lo":[{"address":"127.0.0.1","netmask":"255.0.0.0"}, {"address":"::1","cidr":"::1/128"}]} , "lo"
//     Output:  [{"address":"127.0.0.1","netmask":"255.0.0.0"}, {"address":"::1","cidr":"::1/128"}]
function interfaceHosts(interfaces, itfName) {
    return interfaces[itfName];
}


function renderHeaderTableRow(interfaces) {
    let html = "      <tr>\r\n";
    html += "        <th>Interface</th>\r\n";
    for (const attr of interfaceAttributes(interfaces)) {
        html += "        <th>" + attr + "</th>\r\n";
    }
    html += "      </tr>\r\n";
    return html;
}

function renderAttributeValue(value) {
    return value == null ? "n/a" : value;
}

function renderHostsTableRows(interfaces, itfName) {
    let html = "";
    let hosts = interfaceHosts(interfaces, itfName);
    let attrs = interfaceAttributes(interfaces);
    let rowId = 0;
    for (const host of hosts) {
        rowId += 1;
        html += "      <tr>\r\n";
        if (rowId == 1) {
            html += "        <th rowspan=\"" + hosts.length + "\">" + itfName + "</th>\r\n";
        }
        for (const attr of attrs) {
            html += "        <td>" + renderAttributeValue(host[attr]) + "</td>\r\n";
        }
        html += "      </tr>\r\n";
    }
    return html;
}

function renderTable(interfaces) {
    let html = "    <table border=\"1\" >\r\n" + renderHeaderTableRow(interfaces);
    for (const itfName of interfaceNames(interfaces)) {
        html += renderHostsTableRows(interfaces, itfName);
    }
    html += "    </table>\r\n"; 
    return html;
}

function renderHtml(interfaces) {
    let html = "<html>\r\n"
    html += "  <head>\r\n"
    html += "    <style>\r\n"
    html += "      body { \r\n";
    html += "        font-family: sans-serif; \r\n";
    html += "      } \r\n";
    html += "      th, td { \r\n";
    html += "        padding: 5px; \r\n";
    html += "      } \r\n";
    html += "      th { \r\n";
    html += "        background-color: lightgrey; \r\n";
    html += "      } \r\n";
    html += "      td { \r\n";
    html += "        font-family: monospace; \r\n";
    html += "      } \r\n";
    html += "      tr:hover { \r\n";
    html += "        background-color: lightgreen; \r\n";
    html += "      } \r\n";
    html += "    </style>\r\n"
    html += "  </head>\r\n"
    html += "  <body>\r\n"; 
    html += "    <h1>" + hostname() + "</h1>\r\n"; 
    html += renderTable(interfaces);
    html += "  </body>\r\n</html>\r\n"; 
    return html;
}

var express = require("express"); // See https://expressjs.com/
var app = express();

app.get("/", (req, res, next) => {
    res.send(renderHtml(interfaces));
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

