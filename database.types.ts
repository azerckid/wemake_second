export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          category_id: number
          created_at: string
          description: string
          name: string
          updated_at: string
        }
        Insert: {
          category_id?: never
          created_at?: string
          description: string
          name: string
          updated_at?: string
        }
        Update: {
          category_id?: never
          created_at?: string
          description?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_id: string
          event_type: Database["public"]["Enums"]["event_type"]
          ip_address: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_id?: string
          event_type: Database["public"]["Enums"]["event_type"]
          ip_address?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_id?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          ip_address?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_user_id_profiles_profile_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string | null
          following_id: string | null
        }
        Insert: {
          created_at?: string
          follower_id?: string | null
          following_id?: string | null
        }
        Update: {
          created_at?: string
          follower_id?: string | null
          following_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_profiles_profile_id_fk"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "follows_following_id_profiles_profile_id_fk"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      gpt_ideas: {
        Row: {
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          gpt_idea_id: number
          idea: string
          updated_at: string
          views: number
        }
        Insert: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          gpt_idea_id?: never
          idea: string
          updated_at?: string
          views?: number
        }
        Update: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          gpt_idea_id?: never
          idea?: string
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "gpt_ideas_claimed_by_profiles_profile_id_fk"
            columns: ["claimed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      gpt_ideas_likes: {
        Row: {
          gpt_idea_id: number
          profile_id: string
        }
        Insert: {
          gpt_idea_id: number
          profile_id: string
        }
        Update: {
          gpt_idea_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gpt_ideas_likes_gpt_idea_id_gpt_ideas_gpt_idea_id_fk"
            columns: ["gpt_idea_id"]
            isOneToOne: false
            referencedRelation: "gpt_ideas"
            referencedColumns: ["gpt_idea_id"]
          },
          {
            foreignKeyName: "gpt_ideas_likes_gpt_idea_id_gpt_ideas_gpt_idea_id_fk"
            columns: ["gpt_idea_id"]
            isOneToOne: false
            referencedRelation: "gpt_ideas_view"
            referencedColumns: ["gpt_idea_id"]
          },
          {
            foreignKeyName: "gpt_ideas_likes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      jobs: {
        Row: {
          apply_url: string
          benefits: string
          company_location: string
          company_logo: string
          company_name: string
          created_at: string
          job_id: number
          job_type: Database["public"]["Enums"]["job_type"]
          location: Database["public"]["Enums"]["location"]
          overview: string
          position: string
          profile_id: string | null
          qualifications: string
          responsibilities: string
          salary_range: Database["public"]["Enums"]["salary_range"]
          skills: string
          updated_at: string
        }
        Insert: {
          apply_url: string
          benefits: string
          company_location: string
          company_logo: string
          company_name: string
          created_at?: string
          job_id?: never
          job_type: Database["public"]["Enums"]["job_type"]
          location: Database["public"]["Enums"]["location"]
          overview: string
          position: string
          profile_id?: string | null
          qualifications: string
          responsibilities: string
          salary_range: Database["public"]["Enums"]["salary_range"]
          skills: string
          updated_at?: string
        }
        Update: {
          apply_url?: string
          benefits?: string
          company_location?: string
          company_logo?: string
          company_name?: string
          created_at?: string
          job_id?: never
          job_type?: Database["public"]["Enums"]["job_type"]
          location?: Database["public"]["Enums"]["location"]
          overview?: string
          position?: string
          profile_id?: string | null
          qualifications?: string
          responsibilities?: string
          salary_range?: Database["public"]["Enums"]["salary_range"]
          skills?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      message_room_members: {
        Row: {
          created_at: string
          message_room_id: number
          profile_id: string
        }
        Insert: {
          created_at?: string
          message_room_id: number
          profile_id: string
        }
        Update: {
          created_at?: string
          message_room_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_room_members_message_room_id_message_rooms_message_room"
            columns: ["message_room_id"]
            isOneToOne: false
            referencedRelation: "message_rooms"
            referencedColumns: ["message_room_id"]
          },
          {
            foreignKeyName: "message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      message_rooms: {
        Row: {
          created_at: string
          message_room_id: number
        }
        Insert: {
          created_at?: string
          message_room_id?: never
        }
        Update: {
          created_at?: string
          message_room_id?: never
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          message_id: number
          message_room_id: number | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          message_id?: never
          message_room_id?: number | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          message_id?: never
          message_room_id?: number | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_message_room_id_message_rooms_message_room_id_fk"
            columns: ["message_room_id"]
            isOneToOne: false
            referencedRelation: "message_rooms"
            referencedColumns: ["message_room_id"]
          },
          {
            foreignKeyName: "messages_sender_id_profiles_profile_id_fk"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          notification_id: number
          post_id: number | null
          product_id: number | null
          seen: boolean
          source_id: string | null
          target_id: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          created_at?: string
          notification_id?: never
          post_id?: number | null
          product_id?: number | null
          seen?: boolean
          source_id?: string | null
          target_id: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          created_at?: string
          notification_id?: never
          post_id?: number | null
          product_id?: number | null
          seen?: boolean
          source_id?: string | null
          target_id?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_post_detail"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "notifications_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_post_list_view"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "notifications_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "notifications_product_id_products_product_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_overview_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "notifications_product_id_products_product_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "notifications_source_id_profiles_profile_id_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "notifications_target_id_profiles_profile_id_fk"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      post_replies: {
        Row: {
          created_at: string
          parent_id: number | null
          post_id: number | null
          post_reply_id: number
          profile_id: string
          reply: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          parent_id?: number | null
          post_id?: number | null
          post_reply_id?: never
          profile_id: string
          reply: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          parent_id?: number | null
          post_id?: number | null
          post_reply_id?: never
          profile_id?: string
          reply?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_replies_parent_id_post_replies_post_reply_id_fk"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_replies"
            referencedColumns: ["post_reply_id"]
          },
          {
            foreignKeyName: "post_replies_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_post_detail"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_replies_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_post_list_view"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_replies_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_replies_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      post_upvotes: {
        Row: {
          post_id: number
          profile_id: string
        }
        Insert: {
          post_id: number
          profile_id: string
        }
        Update: {
          post_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_upvotes_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_post_detail"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_upvotes_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_post_list_view"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_upvotes_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_upvotes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          post_id: number
          profile_id: string
          title: string
          topic_id: number
          updated_at: string
          upvotes: number | null
        }
        Insert: {
          content: string
          created_at?: string
          post_id?: never
          profile_id: string
          title: string
          topic_id: number
          updated_at?: string
          upvotes?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          post_id?: never
          profile_id?: string
          title?: string
          topic_id?: number
          updated_at?: string
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "posts_topic_id_topics_topic_id_fk"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_post_detail"
            referencedColumns: ["topic_id"]
          },
          {
            foreignKeyName: "posts_topic_id_topics_topic_id_fk"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["topic_id"]
          },
        ]
      }
      product_upvotes: {
        Row: {
          product_id: number
          profile_id: string
        }
        Insert: {
          product_id: number
          profile_id: string
        }
        Update: {
          product_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_upvotes_product_id_products_product_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_overview_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_upvotes_product_id_products_product_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_upvotes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: number | null
          created_at: string
          description: string
          how_it_works: string
          icon: string
          name: string
          product_id: number
          profile_id: string
          stats: Json
          tagline: string
          updated_at: string
          url: string
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          description: string
          how_it_works: string
          icon: string
          name: string
          product_id?: never
          profile_id: string
          stats?: Json
          tagline: string
          updated_at?: string
          url: string
        }
        Update: {
          category_id?: number | null
          created_at?: string
          description?: string
          how_it_works?: string
          icon?: string
          name?: string
          product_id?: never
          profile_id?: string
          stats?: Json
          tagline?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_categories_category_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "products_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          headline: string | null
          name: string
          profile_id: string
          role: Database["public"]["Enums"]["role"]
          stats: Json | null
          updated_at: string
          username: string
          views: Json | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          headline?: string | null
          name: string
          profile_id: string
          role?: Database["public"]["Enums"]["role"]
          stats?: Json | null
          updated_at?: string
          username: string
          views?: Json | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          headline?: string | null
          name?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["role"]
          stats?: Json | null
          updated_at?: string
          username?: string
          views?: Json | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          product_id: number | null
          profile_id: string | null
          rating: number
          review: string
          review_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          product_id?: number | null
          profile_id?: string | null
          rating: number
          review: string
          review_id?: never
          updated_at?: string
        }
        Update: {
          created_at?: string
          product_id?: number | null
          profile_id?: string | null
          rating?: number
          review?: string
          review_id?: never
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_products_product_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_overview_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "reviews_product_id_products_product_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "reviews_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      team_members: {
        Row: {
          equity_percentage: number | null
          joined_at: string
          role: string
          status: string
          team_id: number
          team_member_id: number
          user_id: string
        }
        Insert: {
          equity_percentage?: number | null
          joined_at?: string
          role: string
          status: string
          team_id: number
          team_member_id?: number
          user_id: string
        }
        Update: {
          equity_percentage?: number | null
          joined_at?: string
          role?: string
          status?: string
          team_id?: number
          team_member_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_teams_team_id_fk"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_members_user_id_profiles_profile_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      teams: {
        Row: {
          application_deadline: string | null
          created_at: string
          equity_split: number
          location: Database["public"]["Enums"]["team_location"]
          max_team_size: number | null
          product_description: string
          product_name: string
          product_stage: Database["public"]["Enums"]["product_stage"]
          roles: string
          team_id: number
          team_leader_id: string
          team_size: number
          team_status: Database["public"]["Enums"]["team_status"]
          tech_stack: string[] | null
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          created_at?: string
          equity_split: number
          location?: Database["public"]["Enums"]["team_location"]
          max_team_size?: number | null
          product_description: string
          product_name: string
          product_stage?: Database["public"]["Enums"]["product_stage"]
          roles: string
          team_id?: number
          team_leader_id: string
          team_size: number
          team_status?: Database["public"]["Enums"]["team_status"]
          tech_stack?: string[] | null
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          created_at?: string
          equity_split?: number
          location?: Database["public"]["Enums"]["team_location"]
          max_team_size?: number | null
          product_description?: string
          product_name?: string
          product_stage?: Database["public"]["Enums"]["product_stage"]
          roles?: string
          team_id?: number
          team_leader_id?: string
          team_size?: number
          team_status?: Database["public"]["Enums"]["team_status"]
          tech_stack?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_team_leader_id_profiles_profile_id_fk"
            columns: ["team_leader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string
          name: string
          slug: string
          topic_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          name: string
          slug: string
          topic_id?: never
          updated_at?: string
        }
        Update: {
          created_at?: string
          name?: string
          slug?: string
          topic_id?: never
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      community_post_detail: {
        Row: {
          author_avatar: string | null
          author_created_at: string | null
          author_name: string | null
          author_role: Database["public"]["Enums"]["role"] | null
          content: string | null
          created_at: string | null
          is_upvoted: boolean | null
          post_id: number | null
          products: number | null
          replies: number | null
          title: string | null
          topic_id: number | null
          topic_name: string | null
          topic_slug: string | null
          upvotes: number | null
        }
        Relationships: []
      }
      community_post_list_view: {
        Row: {
          author: string | null
          author_avatar: string | null
          author_username: string | null
          created_at: string | null
          is_upvoted: boolean | null
          post_id: number | null
          title: string | null
          topic: string | null
          topic_slug: string | null
          upvotes: number | null
        }
        Relationships: []
      }
      gpt_ideas_view: {
        Row: {
          claimed_at: string | null
          claimed_by: string | null
          created_at: string | null
          gpt_idea_id: number | null
          idea: string | null
          is_claimed: boolean | null
          is_liked: boolean | null
          likes: number | null
          views: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gpt_ideas_claimed_by_profiles_profile_id_fk"
            columns: ["claimed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      product_overview_view: {
        Row: {
          average_rating: number | null
          category_id: number | null
          created_at: string | null
          description: string | null
          how_it_works: string | null
          icon: string | null
          name: string | null
          product_id: number | null
          profile_id: string | null
          reviews: number | null
          tagline: string | null
          updated_at: string | null
          upvotes: number | null
          url: string | null
          views: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_categories_category_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "products_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
    }
    Functions: {
      get_dashboard_stats: {
        Args: { user_id: string }
        Returns: {
          month: string
          views: number
        }[]
      }
      get_product_stats: {
        Args: { product_id: string }
        Returns: {
          month: string
          product_views: number
          product_visits: number
        }[]
      }
      track_event: {
        Args: {
          p_event_data?: Json
          p_event_type: Database["public"]["Enums"]["event_type"]
          p_ip_address?: string
          p_referrer?: string
          p_session_id?: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: string
      }
      track_simple_event: {
        Args: {
          p_event_data?: Json
          p_event_type: Database["public"]["Enums"]["event_type"]
        }
        Returns: string
      }
      upsert_category: {
        Args: { p_description: string; p_name: string }
        Returns: number
      }
      upsert_topic: {
        Args: { p_name: string; p_slug: string }
        Returns: number
      }
    }
    Enums: {
      event_type:
        | "product_view"
        | "product_visit"
        | "profile_view"
        | "idea_view"
        | "idea_claim"
        | "post_view"
        | "post_create"
        | "post_like"
        | "job_view"
        | "job_apply"
        | "team_view"
        | "team_join"
        | "page_view"
        | "search"
        | "click"
        | "conversion"
      job_type: "full-time" | "part-time" | "freelance" | "internship"
      location: "remote" | "in-person" | "hybrid"
      notification_type: "follow" | "review" | "reply" | "mention"
      product_stage: "idea" | "prototype" | "mvp" | "product"
      role:
        | "developer"
        | "designer"
        | "marketer"
        | "founder"
        | "product-manager"
      salary_range:
        | "$0 - $50,000"
        | "$50,000 - $70,000"
        | "$70,000 - $100,000"
        | "$100,000 - $120,000"
        | "$120,000 - $150,000"
        | "$150,000 - $250,000"
        | "$250,000+"
      team_location: "remote" | "hybrid" | "onsite"
      team_status: "recruiting" | "active" | "inactive" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      event_type: [
        "product_view",
        "product_visit",
        "profile_view",
        "idea_view",
        "idea_claim",
        "post_view",
        "post_create",
        "post_like",
        "job_view",
        "job_apply",
        "team_view",
        "team_join",
        "page_view",
        "search",
        "click",
        "conversion",
      ],
      job_type: ["full-time", "part-time", "freelance", "internship"],
      location: ["remote", "in-person", "hybrid"],
      notification_type: ["follow", "review", "reply", "mention"],
      product_stage: ["idea", "prototype", "mvp", "product"],
      role: ["developer", "designer", "marketer", "founder", "product-manager"],
      salary_range: [
        "$0 - $50,000",
        "$50,000 - $70,000",
        "$70,000 - $100,000",
        "$100,000 - $120,000",
        "$120,000 - $150,000",
        "$150,000 - $250,000",
        "$250,000+",
      ],
      team_location: ["remote", "hybrid", "onsite"],
      team_status: ["recruiting", "active", "inactive", "completed"],
    },
  },
} as const