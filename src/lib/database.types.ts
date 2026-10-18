
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "categories": {
                  Row: {
                    "created_at": string,"id": number,"label": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: number,"label": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"id"?: number,"label"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"goals": {
                  Row: {
                    "amount": number,"created_at": string,"id": number,"updated_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "amount": number,"created_at"?: string,"id"?: number,"updated_at"?: string,"user_id"?: string
                  }
                  Update: {
                    "amount"?: number,"created_at"?: string,"id"?: number,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"items": {
                  Row: {
                    "base_item_type": string | null,"created_at": string,"generated_item_name": string | null,"id": string,"item_name_raw": string | null,"price_per_unit": number | null,"quantity": number | null,"receipt_id": string,"subcategory_id": number | null,"total_price": number | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "base_item_type"?: string | null,"created_at"?: string,"generated_item_name"?: string | null,"id"?: string,"item_name_raw"?: string | null,"price_per_unit"?: number | null,"quantity"?: number | null,"receipt_id": string,"subcategory_id"?: number | null,"total_price"?: number | null,"updated_at"?: string
                  }
                  Update: {
                    "base_item_type"?: string | null,"created_at"?: string,"generated_item_name"?: string | null,"id"?: string,"item_name_raw"?: string | null,"price_per_unit"?: number | null,"quantity"?: number | null,"receipt_id"?: string,"subcategory_id"?: number | null,"total_price"?: number | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "items_receipt_id_fkey"
      columns: ["receipt_id"]
isOneToOne: false
      referencedRelation: "receipts"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "items_subcategory_id_fkey"
      columns: ["subcategory_id"]
isOneToOne: false
      referencedRelation: "subcategories"
      referencedColumns: ["id"]
    }
                  ]
                },"merchants": {
                  Row: {
                    "created_at": string,"id": string,"logo_url": string | null,"name": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"logo_url"?: string | null,"name": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"logo_url"?: string | null,"name"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"receipts": {
                  Row: {
                    "category_id": number | null,"created_at": string,"id": string,"merchant_id": string | null,"object_key": string | null,"ocr_text": string | null,"possible_duplicate_of": string | null,"reviewed": boolean,"sales_tax": number | null,"subtotal": number | null,"total_amount": number | null,"transaction_date": string | null,"updated_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "category_id"?: number | null,"created_at"?: string,"id"?: string,"merchant_id"?: string | null,"object_key"?: string | null,"ocr_text"?: string | null,"possible_duplicate_of"?: string | null,"reviewed"?: boolean,"sales_tax"?: number | null,"subtotal"?: number | null,"total_amount"?: number | null,"transaction_date"?: string | null,"updated_at"?: string,"user_id"?: string
                  }
                  Update: {
                    "category_id"?: number | null,"created_at"?: string,"id"?: string,"merchant_id"?: string | null,"object_key"?: string | null,"ocr_text"?: string | null,"possible_duplicate_of"?: string | null,"reviewed"?: boolean,"sales_tax"?: number | null,"subtotal"?: number | null,"total_amount"?: number | null,"transaction_date"?: string | null,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "receipts_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "categories"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "receipts_merchant_id_fkey"
      columns: ["merchant_id"]
isOneToOne: false
      referencedRelation: "merchants"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "receipts_possible_duplicate_of_fkey"
      columns: ["possible_duplicate_of"]
isOneToOne: false
      referencedRelation: "receipts"
      referencedColumns: ["id"]
    }
                  ]
                },"subcategories": {
                  Row: {
                    "category_id": number,"created_at": string,"id": number,"name": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "category_id": number,"created_at"?: string,"id"?: number,"name": string,"updated_at"?: string
                  }
                  Update: {
                    "category_id"?: number,"created_at"?: string,"id"?: number,"name"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "subcategories_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "categories"
      referencedColumns: ["id"]
    }
                  ]
                },"subscription_records": {
                  Row: {
                    "created_at": string,"end_date": string,"id": number,"stripe_customer_id": string,"stripe_subscription_id": string,"subscription_status": string,"updated_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"end_date": string,"id"?: number,"stripe_customer_id": string,"stripe_subscription_id": string,"subscription_status": string,"updated_at"?: string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"end_date"?: string,"id"?: number,"stripe_customer_id"?: string,"stripe_subscription_id"?: string,"subscription_status"?: string,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "analytics_category_totals":
{ Args: { "p_end_date"?: string,"p_start_date"?: string }; Returns: {
              "category": string,"total": number
            }[]
                           },
"analytics_merchant_counts":
{ Args: { "p_end_date"?: string,"p_start_date"?: string }; Returns: {
              "count": number,"merchant": string
            }[]
                           },
"analytics_monthly_totals":
{ Args: { "p_end_date"?: string,"p_start_date"?: string }; Returns: {
              "month_date": string,"total": number
            }[]
                           },
"analytics_overview":
{ Args: { "p_end_date"?: string,"p_start_date"?: string }; Returns: {
              "avg_receipt_total": number,"receipt_count": number,"total_amount": number
            }[]
                           },
"analytics_spending_explorer":
{ Args: { "p_dimension"?: string,"p_end_date": string,"p_granularity"?: string,"p_start_date": string }; Returns: {
              "category": string,"date": string,"total_spent": number
            }[]
                           },
"analytics_spending_overview":
{ Args: Record<PropertyKey, never>; Returns: {
              "comparison": number,"current_month_spend": number,"forecasted_spend": number,"goal_budget": number,"previous_month_spend": number,"remaining_budget": number
            }[]
                           },
"analytics_subcategory_totals":
{ Args: { "p_end_date"?: string,"p_start_date"?: string }; Returns: {
              "category": string,"total": number
            }[]
                           },
"analytics_top_base_items":
{ Args: { "p_end_date"?: string,"p_start_date"?: string }; Returns: {
              "label": string,"ratio": number,"total": number
            }[]
                           },
"update_receipt":
{ Args: { "p_items": Json,"p_merchant_id"?: string,"p_receipt_id": string,"p_sales_tax"?: number,"p_subtotal"?: number,"p_total"?: number,"p_transaction_date"?: string }; Returns: undefined
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            
          }
        }
} as const
