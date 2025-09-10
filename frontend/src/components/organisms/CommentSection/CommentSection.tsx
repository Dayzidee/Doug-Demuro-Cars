import { useState } from 'react';
import { Send } from 'lucide-react';

interface Comment {
    id: string;
    author: string;
    avatarUrl: string;
    text: string;
    timestamp: string;
}

const mockComments: Comment[] = [
    { id: '1', author: 'CarEnthusiast', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', text: 'This is a beautiful machine! Any videos of a cold start?', timestamp: '2 hours ago' },
    { id: '2', author: 'SpeedDemon', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', text: 'What is the reserve price on this auction?', timestamp: '1 hour ago' },
];

const CommentSection = () => {
    const [comments, setComments] = useState(mockComments);
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        const newCommentObj: Comment = {
            id: (comments.length + 1).toString(),
            author: 'CurrentUser', // Placeholder
            avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
            text: newComment,
            timestamp: 'Just now',
        };
        setComments([...comments, newCommentObj]);
        setNewComment('');
    };

    const formInputStyles = "w-full bg-backgrounds-card border border-glass p-sm text-white placeholder-neutral-metallic-silver/50 focus:outline-none focus:ring-2 focus:ring-primary-electric-cyan transition-all duration-300 rounded-md";

    return (
        <div>
            <h3 className="text-xl font-semibold mb-md">Community Comments</h3>
            <div className="space-y-md">
                {comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-sm">
                        <img src={comment.avatarUrl} alt={comment.author} className="w-10 h-10 rounded-full" />
                        <div className="bg-glass p-sm rounded-lg flex-1">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-white">{comment.author}</p>
                                <p className="text-xs text-neutral-metallic-silver/70">{comment.timestamp}</p>
                            </div>
                            <p className="text-white/90 mt-xs">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="mt-lg flex items-center gap-sm">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a question or leave a comment..."
                    className={formInputStyles}
                />
                <button type="submit" className="p-2 rounded-md bg-primary-gradient text-white hover:opacity-90 transition-opacity">
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default CommentSection;
