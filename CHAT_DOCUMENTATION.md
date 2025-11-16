# Chat Application Documentation

## Overview
This is a modern chat application built with React, TypeScript, and Tailwind CSS that supports multiple message types including text, images, videos, and PDF documents.

## Features Implemented

### 1. ✅ Responsive Chat Interface
- Mobile-first design that adapts to all screen sizes
- Clean, modern UI inspired by professional messaging apps
- Smooth animations and transitions

### 2. ✅ Multiple Message Types
- **Text Messages**: Standard text communication
- **Image Messages**: Display images with preview and full-size view
- **Video Messages**: Embedded video player with controls
- **PDF Messages**: File attachment display with download option

### 3. ✅ User Roles & Identification
- Three user roles: Admin, Agent, Customer
- Color-coded avatars for each role:
  - Admin: Purple
  - Agent: Green
  - Customer: Blue
- Role badges in chat header

### 4. ✅ Chat Room Features
- Room header with room name and image
- Participant list with role indicators
- Message timestamps
- Avatar display for each message

## Extended JSON Format

The application supports the following extended JSON format for messages:

### Text Message
```json
{
  "id": 885512,
  "type": "text",
  "message": "Hello, how can I help you?",
  "sender": "agent@mail.com",
  "timestamp": "2024-03-15T19:30:00Z"
}
```

### Image Message
```json
{
  "id": 885517,
  "type": "image",
  "message": "Here's the proof of payment",
  "image_url": "https://example.com/image.jpg",
  "sender": "customer@mail.com",
  "timestamp": "2024-03-15T19:31:30Z"
}
```

### Video Message
```json
{
  "id": 885521,
  "type": "video",
  "message": "Tutorial video",
  "video_url": "https://example.com/video.mp4",
  "thumbnail_url": "https://example.com/thumbnail.jpg",
  "sender": "agent@mail.com",
  "timestamp": "2024-03-15T19:36:00Z"
}
```

### PDF Message
```json
{
  "id": 885519,
  "type": "pdf",
  "message": "Invoice document",
  "pdf_url": "https://example.com/document.pdf",
  "file_name": "invoice_12456.pdf",
  "file_size": "245 KB",
  "sender": "customer@mail.com",
  "timestamp": "2024-03-15T19:32:30Z"
}
```

## Room Structure
```json
{
  "room": {
    "name": "Product A",
    "id": 12456,
    "image_url": "https://example.com/room-image.jpg",
    "participant": [
      {
        "id": "admin@mail.com",
        "name": "Admin",
        "role": 0
      },
      {
        "id": "agent@mail.com",
        "name": "Agent A",
        "role": 1
      },
      {
        "id": "customer@mail.com",
        "name": "Customer Name",
        "role": 2
      }
    ]
  },
  "comments": [ /* Array of messages */ ]
}
```

## User Roles
- **Role 0**: Admin - System administrator
- **Role 1**: Agent - Customer service agent
- **Role 2**: Customer - End user

## Technical Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui components
- **Build Tool**: Vite
- **State Management**: React hooks (useState, useEffect)

## File Structure
```
src/
├── components/
│   └── chat/
│       ├── ChatHeader.tsx       # Room header with participants
│       ├── MessageBubble.tsx    # Individual message component
│       ├── MessageList.tsx      # Scrollable message container
│       └── MessageInput.tsx     # Message input with attachment options
├── data/
│   └── chat-data.json          # Sample chat data
├── types/
│   └── chat.ts                 # TypeScript type definitions
└── pages/
    └── Index.tsx               # Main chat page
```

## Design System
The application uses a comprehensive design system defined in `src/index.css`:

### Color Scheme
- **Primary**: Blue (#3B82F6) - Main brand color
- **Agent**: Green - Agent messages
- **Admin**: Purple - Admin messages
- **Customer**: Blue - Customer messages

### Key Features
- Semantic color tokens for consistency
- Dark mode support
- Smooth animations and transitions
- Responsive typography
- Custom chat bubble styles

## Future Enhancements
- Real-time messaging with WebSocket
- Message delivery status indicators
- Typing indicators
- File upload functionality
- Message reactions and replies
- Search functionality
- Message editing and deletion
- User presence indicators

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
