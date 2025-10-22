export type Database = {
    public: {
        Tables: {
            [key: string]: {
                Row: Record<string, any>;
                Insert: Record<string, any>;
                Update: Record<string, any>;
            };
        };
    };
};
