# MCP Server Installation Guide for Augment

This guide provides detailed step-by-step instructions for installing and configuring Model Context Protocol (MCP) servers with Augment. MCP servers extend Augment's capabilities by providing access to external tools and data sources.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installing the Smithery CLI](#installing-the-smithery-cli)
3. [Installing the Think MCP Server](#installing-the-think-mcp-server)
4. [Installing the MySQL MCP Server](#installing-the-mysql-mcp-server)
5. [Configuring Augment to Use MCP Servers](#configuring-augment-to-use-mcp-servers)
6. [Testing the MCP Servers](#testing-the-mcp-servers)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following:

- Node.js and npm installed on your system
- Augment installed in your code editor
- Administrator access to your system (for installing global packages)
- For MySQL MCP server: MySQL server running with appropriate credentials

## Installing the Smithery CLI

The Smithery CLI is a command-line tool that helps you install and run MCP servers.

1. Open a terminal or command prompt
2. Install the Smithery CLI globally using npm:

```bash
npm install @smithery/cli@latest -g
```

3. Verify the installation:

```bash
npx @smithery/cli --help
```

## Installing the Think MCP Server

The Think MCP Server provides enhanced reasoning capabilities for Augment.

1. Install the Think MCP Server using the Smithery CLI:

```bash
npx @smithery/cli install @PhillipRt/think-mcp-server --client cursor --key 48a1a836-25b3-4f2e-a88b-39b47c09b85a
```

Note: We're using the `cursor` client instead of `vscode` because of potential integration issues with VS Code.

2. Verify the installation by running the server:

```bash
npx @smithery/cli run @PhillipRt/think-mcp-server --key 48a1a836-25b3-4f2e-a88b-39b47c09b85a
```

The server should start without errors. You can press Ctrl+C to stop it.

## Installing the MySQL MCP Server

The MySQL MCP Server provides access to MySQL databases.

1. Install the MySQL MCP Server using the Smithery CLI:

```bash
npx @smithery/cli install mysql-mcp-server --client cursor --config '"{\"mysqlHost\":\"host.docker.internal\",\"mysqlPort\":\"3306\",\"mysqlUser\":\"root\",\"mysqlDatabase\":\"sarasvishva\",\"mysqlPassword\":\"ujkxco2920@\"}"'
```

Replace the configuration values with your MySQL server details:
- `mysqlHost`: Your MySQL server hostname (use `host.docker.internal` if running in Docker)
- `mysqlPort`: Your MySQL server port (usually 3306)
- `mysqlUser`: Your MySQL username
- `mysqlDatabase`: Your MySQL database name
- `mysqlPassword`: Your MySQL password

2. Verify the installation by running the server:

```bash
npx @smithery/cli run mysql-mcp-server --config "{\"mysqlHost\":\"host.docker.internal\",\"mysqlPort\":\"3306\",\"mysqlUser\":\"root\",\"mysqlDatabase\":\"sarasvishva\",\"mysqlPassword\":\"ujkxco2920@\"}"
```

The server should start without errors. You can press Ctrl+C to stop it.

## Configuring Augment to Use MCP Servers

To configure Augment to use the MCP servers, you need to update the configuration files.

### Method 1: Using .vscode/settings.json

1. Create a `.vscode` directory in your project root if it doesn't exist:

```bash
mkdir -p .vscode
```

2. Create or edit the `.vscode/settings.json` file with the following content:

```json
{
  "augment.advanced": {
    "mcpServers": [
      {
        "name": "think-mcp-server",
        "command": "npx",
        "args": ["@smithery/cli", "run", "@PhillipRt/think-mcp-server", "--key", "48a1a836-25b3-4f2e-a88b-39b47c09b85a"]
      },
      {
        "name": "mysql-mcp-server",
        "command": "npx",
        "args": ["@smithery/cli", "run", "mysql-mcp-server", "--config", "{\"mysqlHost\":\"host.docker.internal\",\"mysqlPort\":\"3306\",\"mysqlUser\":\"root\",\"mysqlDatabase\":\"sarasvishva\",\"mysqlPassword\":\"ujkxco2920@\"}"]
      }
    ]
  }
}
```

### Method 2: Using .augment/config.json

1. Create a `.augment` directory in your project root if it doesn't exist:

```bash
mkdir -p .augment
```

2. Create or edit the `.augment/config.json` file with the following content:

```json
{
  "augment.advanced": {
    "mcpServers": [
      {
        "name": "think-mcp-server",
        "command": "npx",
        "args": ["@smithery/cli", "run", "@PhillipRt/think-mcp-server", "--key", "48a1a836-25b3-4f2e-a88b-39b47c09b85a"]
      },
      {
        "name": "mysql-mcp-server",
        "command": "npx",
        "args": ["@smithery/cli", "run", "mysql-mcp-server", "--config", "{\"mysqlHost\":\"host.docker.internal\",\"mysqlPort\":\"3306\",\"mysqlUser\":\"root\",\"mysqlDatabase\":\"sarasvishva\",\"mysqlPassword\":\"ujkxco2920@\"}"]
      }
    ]
  }
}
```

3. Restart your code editor for the changes to take effect.

## Testing the MCP Servers

After restarting your code editor, you can test if the MCP servers are working correctly.

### Testing the Think MCP Server

You can test if Augment has access to the Think MCP Server by asking it to use the thinking capability:

```
Can you use the thinking server to solve this problem: What is the sum of the first 100 natural numbers?
```

Augment should use the thinking server to work through the problem step by step.

### Testing the MySQL MCP Server

You can test if Augment has access to the MySQL MCP Server by asking it to query your database:

```
Can you list all tables in the sarasvishva database?
```

Augment should be able to connect to your MySQL database and list the tables.

## Troubleshooting

If you encounter issues with the MCP servers, try the following:

1. **Check if the servers are running:**
   Run the servers manually to see if there are any errors:

   ```bash
   npx @smithery/cli run @PhillipRt/think-mcp-server --key 48a1a836-25b3-4f2e-a88b-39b47c09b85a
   ```

   ```bash
   npx @smithery/cli run mysql-mcp-server --config "{\"mysqlHost\":\"host.docker.internal\",\"mysqlPort\":\"3306\",\"mysqlUser\":\"root\",\"mysqlDatabase\":\"sarasvishva\",\"mysqlPassword\":\"ujkxco2920@\"}"
   ```

2. **Check the configuration files:**
   Make sure the configuration files (`.vscode/settings.json` and `.augment/config.json`) have the correct format and values.

3. **Restart your code editor:**
   Sometimes, changes to the configuration files require a restart of the code editor to take effect.

4. **Check for network issues:**
   For the MySQL MCP server, make sure your MySQL server is running and accessible from your machine.

5. **Try a different client:**
   If you're having issues with the `vscode` client, try using the `cursor` client instead.

6. **Check for updates:**
   Make sure you're using the latest version of the Smithery CLI and MCP servers:

   ```bash
   npm update @smithery/cli -g
   ```

7. **Check the Smithery documentation:**
   Visit the [Smithery documentation](https://smithery.ai/docs) for more information on MCP servers and troubleshooting.

---

By following this guide, you should be able to install and configure MCP servers with Augment on any PC. If you have any questions or issues, feel free to ask Augment for help!
