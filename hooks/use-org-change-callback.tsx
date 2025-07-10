import { useActiveOrganization } from "@/lib/auth-client";
import { useRef, useEffect } from "react";

// use this hook to call a callback when the active org changes. will not call the callback on initial mount.
export function useOrgChangeCallback(callback: () => void) {
    const { data: activeOrg } = useActiveOrganization();
    const activeOrgId = useRef(activeOrg?.id);
    const hasMounted = useRef(false);
    const callbackRef = useRef(callback);
    
    // Always keep the callback ref up to date
    callbackRef.current = callback;
    
    // invoke callback when active org changes (but not on initial mount)
    useEffect(() => {
        // Skip on initial mount
        if (!hasMounted.current) {
            hasMounted.current = true;
            activeOrgId.current = activeOrg?.id;
            return;
        }

        // Only trigger if the org actually changed
        if (activeOrgId.current !== activeOrg?.id) {
            activeOrgId.current = activeOrg?.id;
            callbackRef.current();
        }
    }, [activeOrg]);
}