# 🚀 Multiboard - Open-Source Kanban for Modern Teams

**Streamline your workflow with intuitive task management and real-time collaboration. Built for teams who value simplicity and control.**

---

> **Multiboard is now part of [BTST](https://better-stack.ai/)** — ship full-stack features faster with production-ready plugins that generate database schemas, API routes, and pages for Next.js, TanStack Start, and React Router.

---

## 🎨 Screenshots


### Dark Mode
![Multiboard Dark Mode](./public/example-dark.png)

### Light Mode  
![Multiboard Light Mode](./public/example-light.png)


## ✨ Why Open-Source Kanban?

- **🔓 Complete Control**: Own your data, customize without limits, deploy anywhere
- **💰 Cost-Effective**: No per-user fees or subscription locks - scale freely 
- **🔒 Privacy First**: Keep sensitive project data on your own infrastructure
- **🛠️ Extensible**: Modify and extend functionality to match your exact needs
- **🌍 Community-Driven**: Benefit from collective improvements and security reviews
- **🏢 Enterprise Ready**: Self-host with confidence for compliance and security requirements

## 🎯 Features

- **📋 Intuitive Kanban Boards**: Drag-and-drop task management with unlimited columns
- **👥 Team Collaboration**: Real-time updates, comments, and seamless teamwork
- **🏢 Multi-Organization**: Manage multiple teams and organizations in one place
- **⚡ Lightning Fast**: Built with modern web technologies for instant interactions
- **🔐 Secure Authentication**: Enterprise-grade security with flexible auth options
- **📱 Mobile Responsive**: Perfect experience across all devices
- **🎨 Rich Text Editor**: Full-featured task descriptions with markdown support
- **📎 File Attachments**: Upload and manage files directly in tasks
- **🔔 Smart Notifications**: Stay updated with intelligent notification system
- **📊 Auto-Generated APIs**: Type-safe REST APIs with interactive documentation
- **🚀 One-Click Deploy**: Easy deployment to Vercel or your own infrastructure
- **📝 Blog Post Management**: Full CRUD operations for blog posts with rich text editing for site admin users

## 🛠️ Technology Stack

| Technology | Purpose | Link |
|------------|---------|------|
| **better-auth** | Authentication and authorization | [better-auth.com](https://www.better-auth.com/) |
| **better-auth-ui** | Plug and play auth UI components | [better-auth-ui.com](https://better-auth-ui.com/) |
| **shadcn/ui** | Beautifully-designed, accessible components | [ui.shadcn.com](https://ui.shadcn.com/) |
| **Prisma** | PostgreSQL ORM and database toolkit | [prisma.io](https://www.prisma.io/postgres) |
| **ZenStack** | TypeScript toolkit enhancing Prisma with authorization and auto-generated APIs | [zenstack.dev](https://zenstack.dev/) |
| **TanStack Query** | Powerful data-fetching and state management | [tanstack.com/query](https://tanstack.com/query/latest/docs/framework/react/overview) |
| **Scalar** | Beautiful API documentation | [scalar.com](https://guides.scalar.com/scalar/scalar-api-references/integrations/nextjs) |
| **AutoForm** | Generate forms from Zod schemas | [github.com/vantezzen/autoform](https://github.com/vantezzen/autoform) |
| **Minimal Tiptap** | Clean and minimal rich text editor | [github.com/Aslam97/shadcn-minimal-tiptap](https://github.com/Aslam97/shadcn-minimal-tiptap) |
| **nuqs** | Type-safe search params state manager | [nuqs.47ng.com](https://nuqs.47ng.com/) |
| **Vercel Blob** | Scalable file and image storage | [vercel.com/docs/vercel-blob](https://vercel.com/docs/vercel-blob) |
| **Resend** | Modern email delivery platform | [resend.com](https://resend.com/) |
| **DiceUI Kanban** | Beautiful kanban component library | [diceui.com/docs/components/kanban](https://www.diceui.com/docs/components/kanban) |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm, yarn, pnpm, or bun

### 1. Clone & Install

```bash
git clone https://github.com/olliethedev/multiboard.git
cd multiboard
npm install
```

### 2. Environment Setup

Create a `.env.local` or `.env` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/multiboard"

# Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Email (for organization invites and password resets)
RESEND_API_KEY="your-resend-api-key"
FROM_EMAIL="noreply@yourdomain.com"

# File Storage (for task attachments and profile pictures)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### 3. Database Setup

```bash
# Generate the database client and API
npm run zenstack:generate

# Push the schema to your database
npm run prisma:push
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your kanban boards!

### 5. Create a blog post
You must have a user with the role `admin` to create a blog post.
Navigate to `/posts/new` to create a blog post.
Admin users will see special UI related to blog posts, like editing the blog post, and draft posts.

## 📚 API Documentation

Multiboard automatically generates comprehensive API documentation:

- **Interactive API Docs**: Visit `/api/openapi/reference` for full API exploration
- **OpenAPI Schema**: Available at `/api/openapi/openapi.json`
- **Type-Safe Hooks**: Auto-generated React Query hooks for seamless frontend integration

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/olliethedev/multiboard)

1. Add environment variables
2. Deploy with the custom build command: `npm run vercel:build`


## 🏗️ Project Structure

```
multiboard/
├── app/                   # Next.js app directory
│   ├── boards/            # Kanban board pages
│   ├── posts/             # Blog pages
│   ├── api/               # API routes, auth, and OpenAPI docs
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── boards/            # Board-specific components
│   ├── marketing/         # Landing page components
│   ├── posts/             # Blog components
│   └── ui/                # Reusable UI components
├── hooks/                 # Utility hooks and auto-generated React Query hooks
├── lib/                   # Utility functions and configurations
└── schema.zmodel          # ZenStack schema with access policies
```

## 🤝 Contributing

We love contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `npm run lint`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Update documentation as needed
- Ensure all CI checks pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Star History

If you find Multiboard useful, please consider giving it a star on GitHub! ⭐

## 📧 Support

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/olliethedev/multiboard/issues)

---

**Ready to streamline your team's workflow?** [Try Multiboard now](https://multiboard.dev) or [star the repo](https://github.com/olliethedev/multiboard) to show your support! 🚀
