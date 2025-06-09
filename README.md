# Nice NVR Electron

A cross-platform Electron application for managing and monitoring Network Video Recorders (NVRs).

## Features

- Real-time video streaming from NVR devices
- Device management and configuration
- User authentication and access control
- Event and alert notifications
- Cross-platform support (Windows, macOS, Linux)

## Project Structure

- `backend/` - Express.js backend with SQLite database and WebSocket server
- `frontend/` - Vite-powered Svelte frontend
- `src/` - Electron main source

## Technology Stack

- **Backend:** [Express.js](https://expressjs.com/), [SQLite](https://www.sqlite.org/), [WebSocket](https://www.npmjs.com/package/ws)
- **Frontend:** [Vite](https://vitejs.dev/) + [Svelte](https://svelte.dev/)
- **Electron:** [Electron](https://www.electronjs.org/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Installation

```bash
git clone https://github.com/yourusername/nice-nvr-electron.git
cd nice-nvr-electron
yarn install
```

### Prepare Database

```bash
yarn migrate
yarn seed
```

> **Default Admin User:**  
> Username: `admin`  
> Password: `admin123`

### Running the App

```bash
yarn dev
```

### Building for Production

```bash
yarn build
```

```bash
yarn start
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests.

## License

This project is licensed under the MIT License.

**Repository URL:** [https://github.com/yourusername/nice-nvr-electron](https://github.com/yourusername/nice-nvr-electron)
