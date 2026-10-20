import { Icon } from './Icon';

export function EmptyState({
                               title,
                               description,
                           }: {
    title: string;
    description?: string;
}) {
    return (
        <div role="status" className="empty-state">
            <Icon name="search" size={28} className="empty-state__icon" />
            <strong>{title}</strong>
            {description && <p>{description}</p>}
        </div>
    );
}
