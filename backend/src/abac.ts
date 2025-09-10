export type Action =
    | 'send_message'
    | 'create_conversation'
    | 'delete_conversation'
    | 'add_friend'
    | 'block_user'
    | 'change_profile';

export type Attributes = Record<string, any>;

export type Policy = {
    action: Action | string;
    condition: (actorAttrs: Attributes, resourceAttrs: Attributes) => boolean;
};

export const policies: Policy[] = [
    {
        action: 'send_message',
        condition: (actor, resource) => {
            return !resource.blockedBy;
        },
    },
    {
        action: 'delete_conversation',
        condition: (actor, resource) => {
            return (
                resource.participants?.includes(actor.id) ||
                actor.isAdmin === true
            );
        },
    },
];

export function can(
    actorAttrs: Attributes,
    action: Action,
    resourceAttrs: Attributes
): boolean {
    const relevant = policies.filter((p) => p.action === action);
    if (relevant.length === 0) return true;
    return relevant.every((p) => p.condition(actorAttrs, resourceAttrs));
}
