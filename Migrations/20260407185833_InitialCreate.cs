using System;
using System.Collections.Generic;
using CRMKatia.Domain.Entities;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CRMKatia.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    normalized_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    concurrency_stamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    first_name = table.Column<string>(type: "text", nullable: false),
                    last_name = table.Column<string>(type: "text", nullable: false),
                    role = table.Column<int>(type: "integer", nullable: false),
                    photo = table.Column<string>(type: "text", nullable: true),
                    phone = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    last_login = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    user_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    normalized_user_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    normalized_email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    email_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: true),
                    security_stamp = table.Column<string>(type: "text", nullable: true),
                    concurrency_stamp = table.Column<string>(type: "text", nullable: true),
                    phone_number = table.Column<string>(type: "text", nullable: true),
                    phone_number_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    two_factor_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    lockout_end = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    lockout_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    access_failed_count = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "lead",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    business_name = table.Column<string>(type: "text", nullable: false),
                    owner_name = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    phone = table.Column<string>(type: "text", nullable: false),
                    city = table.Column<string>(type: "text", nullable: true),
                    country = table.Column<string>(type: "text", nullable: true),
                    plan_interest = table.Column<string>(type: "text", nullable: true),
                    message = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<string>(type: "text", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: true),
                    email_verified = table.Column<bool>(type: "boolean", nullable: false),
                    verification_code = table.Column<string>(type: "text", nullable: true),
                    verification_code_expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_lead", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "support_message",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    subject = table.Column<string>(type: "text", nullable: false),
                    message = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    priority = table.Column<string>(type: "text", nullable: false),
                    internal_notes = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_support_message", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    role_id = table.Column<Guid>(type: "uuid", nullable: false),
                    claim_type = table.Column<string>(type: "text", nullable: true),
                    claim_value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_role_claims", x => x.id);
                    table.ForeignKey(
                        name: "fk_asp_net_role_claims_asp_net_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "AspNetRoles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    claim_type = table.Column<string>(type: "text", nullable: true),
                    claim_value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_claims", x => x.id);
                    table.ForeignKey(
                        name: "fk_asp_net_user_claims_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    login_provider = table.Column<string>(type: "text", nullable: false),
                    provider_key = table.Column<string>(type: "text", nullable: false),
                    provider_display_name = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_logins", x => new { x.login_provider, x.provider_key });
                    table.ForeignKey(
                        name: "fk_asp_net_user_logins_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    role_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_roles", x => new { x.user_id, x.role_id });
                    table.ForeignKey(
                        name: "fk_asp_net_user_roles_asp_net_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "AspNetRoles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_asp_net_user_roles_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    login_provider = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_tokens", x => new { x.user_id, x.login_provider, x.name });
                    table.ForeignKey(
                        name: "fk_asp_net_user_tokens_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "salons",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    logo = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    cover = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    photos = table.Column<List<string>>(type: "jsonb", nullable: false),
                    city = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    latitude = table.Column<double>(type: "double precision", nullable: true),
                    longitude = table.Column<double>(type: "double precision", nullable: true),
                    plan = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    billing_period = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    subscription_status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    stripe_customer_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    stripe_subscription_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    is_published = table.Column<bool>(type: "boolean", nullable: false),
                    published_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    owner_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_salons", x => x.id);
                    table.ForeignKey(
                        name: "fk_salons_asp_net_users_owner_id",
                        column: x => x.owner_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "clients",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    first_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    last_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    notes = table.Column<string>(type: "text", nullable: true),
                    total_bookings = table.Column<int>(type: "integer", nullable: false),
                    total_spent = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    last_visit = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_clients", x => x.id);
                    table.ForeignKey(
                        name: "fk_clients_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "fk_clients_salon_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "deposit_settings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    deposit_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    deposit_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    fixed_amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    percentage_amount = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    min_deposit_amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    max_deposit_amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    allow_pay_in_salon = table.Column<bool>(type: "boolean", nullable: false),
                    allow_full_payment = table.Column<bool>(type: "boolean", nullable: false),
                    require_deposit_for_new_clients = table.Column<bool>(type: "boolean", nullable: false),
                    cancellation_policy_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    full_refund_hours = table.Column<int>(type: "integer", nullable: false),
                    partial_refund_hours = table.Column<int>(type: "integer", nullable: false),
                    partial_refund_percent = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    no_show_refund = table.Column<bool>(type: "boolean", nullable: false),
                    no_show_penalty = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    allow_reschedule = table.Column<bool>(type: "boolean", nullable: false),
                    reschedule_hours = table.Column<int>(type: "integer", nullable: false),
                    reschedule_limit = table.Column<int>(type: "integer", nullable: false),
                    stripe_connected = table.Column<bool>(type: "boolean", nullable: false),
                    stripe_account_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    platform_fee_percent = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    custom_message = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    auto_reminders = table.Column<bool>(type: "boolean", nullable: false),
                    reminder_hours_before = table.Column<List<int>>(type: "jsonb", nullable: false),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_deposit_settings", x => x.id);
                    table.ForeignKey(
                        name: "fk_deposit_settings_salon_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "gift_cards",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    currency = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    remaining_balance = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    purchaser_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    purchaser_email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    purchaser_user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    recipient_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    recipient_email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    personal_message = table.Column<string>(type: "text", nullable: true),
                    delivery_method = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    theme = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    payment_intent_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    stripe_charge_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    allow_partial_use = table.Column<bool>(type: "boolean", nullable: false),
                    allow_multiple_services = table.Column<bool>(type: "boolean", nullable: false),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    last_used_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_gift_cards", x => x.id);
                    table.ForeignKey(
                        name: "fk_gift_cards_salon_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "masters",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    first_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    last_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    avatar = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    categories = table.Column<List<string>>(type: "jsonb", nullable: false),
                    working_hours = table.Column<List<WorkingHours>>(type: "jsonb", nullable: false),
                    days_off = table.Column<List<string>>(type: "jsonb", nullable: false),
                    vacations = table.Column<List<Vacation>>(type: "jsonb", nullable: false),
                    extra_work_days = table.Column<List<ExtraWorkDay>>(type: "jsonb", nullable: false),
                    rating = table.Column<decimal>(type: "numeric(3,2)", precision: 3, scale: 2, nullable: true),
                    completed_bookings = table.Column<int>(type: "integer", nullable: false),
                    revenue = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    base_salary = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    monthly_target = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    current_revenue = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    bonus_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    bonus_value = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_masters", x => x.id);
                    table.ForeignKey(
                        name: "fk_masters_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "fk_masters_salon_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "salon_invitations",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    token = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    accepted = table.Column<bool>(type: "boolean", nullable: false),
                    accepted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false),
                    invited_by = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_salon_invitations", x => x.id);
                    table.ForeignKey(
                        name: "fk_salon_invitations_asp_net_users_invited_by",
                        column: x => x.invited_by,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_salon_invitations_salons_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "services",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    price = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    duration = table.Column<int>(type: "integer", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    discount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    image_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_services", x => x.id);
                    table.ForeignKey(
                        name: "fk_services_salons_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "bookings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    client_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    client_email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    client_phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    is_new_client = table.Column<bool>(type: "boolean", nullable: false),
                    start_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    end_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    confirmed_date_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    confirmation_required = table.Column<bool>(type: "boolean", nullable: false),
                    confirmation_deadline = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    confirmed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    calendar_slot_status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    temp_hold_expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    reschedule_requested_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    reschedule_requested_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    reschedule_original_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    reschedule_new_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    reschedule_reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    reschedule_expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    decline_reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    declined_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    declined_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    cancellation_reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    cancelled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    cancelled_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    no_show_marked_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    no_show_penalty = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    refund_amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    created_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false),
                    client_id = table.Column<Guid>(type: "uuid", nullable: true),
                    master_id = table.Column<Guid>(type: "uuid", nullable: false),
                    service_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_bookings", x => x.id);
                    table.ForeignKey(
                        name: "fk_bookings_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_bookings_client_client_id",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "fk_bookings_master_master_id",
                        column: x => x.master_id,
                        principalTable: "masters",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_bookings_salon_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_bookings_service_service_id",
                        column: x => x.service_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "feed_posts",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    image_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    caption = table.Column<string>(type: "text", nullable: true),
                    likes = table.Column<int>(type: "integer", nullable: false),
                    comments = table.Column<int>(type: "integer", nullable: false),
                    shares = table.Column<int>(type: "integer", nullable: false),
                    is_service = table.Column<bool>(type: "boolean", nullable: false),
                    service_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    service_category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    original_price = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    discount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    currency = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    is_last_minute = table.Column<bool>(type: "boolean", nullable: false),
                    is_promoted = table.Column<bool>(type: "boolean", nullable: false),
                    duration = table.Column<int>(type: "integer", nullable: true),
                    service_description = table.Column<string>(type: "text", nullable: true),
                    published_to_main_feed = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false),
                    service_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_feed_posts", x => x.id);
                    table.ForeignKey(
                        name: "fk_feed_posts_salon_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_feed_posts_service_service_id",
                        column: x => x.service_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "master_services",
                columns: table => new
                {
                    master_id = table.Column<Guid>(type: "uuid", nullable: false),
                    service_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_master_services", x => new { x.master_id, x.service_id });
                    table.ForeignKey(
                        name: "fk_master_services_masters_master_id",
                        column: x => x.master_id,
                        principalTable: "masters",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_master_services_service_service_id",
                        column: x => x.service_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "booking_payments",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    total_amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    deposit_amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    paid_amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    remaining_amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    payment_option = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    payment_status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    payment_intent_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    charge_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    refund_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    cancelled = table.Column<bool>(type: "boolean", nullable: false),
                    cancelled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    cancel_reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    refund_amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    no_show = table.Column<bool>(type: "boolean", nullable: false),
                    no_show_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    penalty_amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    paid_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    fully_paid_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_booking_payments", x => x.id);
                    table.ForeignKey(
                        name: "fk_booking_payments_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "booking_status_history",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    changed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    changed_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    actor_id = table.Column<Guid>(type: "uuid", nullable: false),
                    actor_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    previous_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    new_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_booking_status_history", x => x.id);
                    table.ForeignKey(
                        name: "fk_booking_status_history_booking_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "gift_card_usages",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    amount_used = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    remaining_after = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    service_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    customer_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    used_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    gift_card_id = table.Column<Guid>(type: "uuid", nullable: false),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: true),
                    customer_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_gift_card_usages", x => x.id);
                    table.ForeignKey(
                        name: "fk_gift_card_usages_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "fk_gift_card_usages_gift_cards_gift_card_id",
                        column: x => x.gift_card_id,
                        principalTable: "gift_cards",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "notifications",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    type = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    message = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    action_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    recipient_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    priority = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    read = table.Column<bool>(type: "boolean", nullable: false),
                    read_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    dismissed = table.Column<bool>(type: "boolean", nullable: false),
                    channels = table.Column<List<string>>(type: "jsonb", nullable: false),
                    sent_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    recipient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: true),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_notifications", x => x.id);
                    table.ForeignKey(
                        name: "fk_notifications_asp_net_users_recipient_id",
                        column: x => x.recipient_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_notifications_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_role_claims_role_id",
                table: "AspNetRoleClaims",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "normalized_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_user_claims_user_id",
                table: "AspNetUserClaims",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_user_logins_user_id",
                table: "AspNetUserLogins",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_user_roles_role_id",
                table: "AspNetUserRoles",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "normalized_email");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "normalized_user_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_booking_payments_booking_id",
                table: "booking_payments",
                column: "booking_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_booking_status_history_booking_id",
                table: "booking_status_history",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "ix_bookings_client_id",
                table: "bookings",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "ix_bookings_confirmation_deadline",
                table: "bookings",
                column: "confirmation_deadline");

            migrationBuilder.CreateIndex(
                name: "ix_bookings_master_id_start_time",
                table: "bookings",
                columns: new[] { "master_id", "start_time" });

            migrationBuilder.CreateIndex(
                name: "ix_bookings_salon_id_status",
                table: "bookings",
                columns: new[] { "salon_id", "status" });

            migrationBuilder.CreateIndex(
                name: "ix_bookings_service_id",
                table: "bookings",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "ix_bookings_start_time",
                table: "bookings",
                column: "start_time");

            migrationBuilder.CreateIndex(
                name: "ix_bookings_user_id",
                table: "bookings",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_clients_salon_id",
                table: "clients",
                column: "salon_id");

            migrationBuilder.CreateIndex(
                name: "ix_clients_user_id",
                table: "clients",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_deposit_settings_salon_id",
                table: "deposit_settings",
                column: "salon_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_feed_posts_salon_id",
                table: "feed_posts",
                column: "salon_id");

            migrationBuilder.CreateIndex(
                name: "ix_feed_posts_service_id",
                table: "feed_posts",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "ix_gift_card_usages_booking_id",
                table: "gift_card_usages",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "ix_gift_card_usages_gift_card_id",
                table: "gift_card_usages",
                column: "gift_card_id");

            migrationBuilder.CreateIndex(
                name: "ix_gift_cards_code",
                table: "gift_cards",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_gift_cards_salon_id",
                table: "gift_cards",
                column: "salon_id");

            migrationBuilder.CreateIndex(
                name: "ix_master_services_service_id",
                table: "master_services",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "ix_masters_email",
                table: "masters",
                column: "email");

            migrationBuilder.CreateIndex(
                name: "ix_masters_salon_id",
                table: "masters",
                column: "salon_id");

            migrationBuilder.CreateIndex(
                name: "ix_masters_user_id",
                table: "masters",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_notifications_booking_id",
                table: "notifications",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "ix_notifications_recipient_id",
                table: "notifications",
                column: "recipient_id");

            migrationBuilder.CreateIndex(
                name: "ix_salon_invitations_invited_by",
                table: "salon_invitations",
                column: "invited_by");

            migrationBuilder.CreateIndex(
                name: "ix_salon_invitations_salon_id",
                table: "salon_invitations",
                column: "salon_id");

            migrationBuilder.CreateIndex(
                name: "ix_salon_invitations_token",
                table: "salon_invitations",
                column: "token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_salons_is_published",
                table: "salons",
                column: "is_published");

            migrationBuilder.CreateIndex(
                name: "ix_salons_owner_id",
                table: "salons",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_services_salon_id",
                table: "services",
                column: "salon_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "booking_payments");

            migrationBuilder.DropTable(
                name: "booking_status_history");

            migrationBuilder.DropTable(
                name: "deposit_settings");

            migrationBuilder.DropTable(
                name: "feed_posts");

            migrationBuilder.DropTable(
                name: "gift_card_usages");

            migrationBuilder.DropTable(
                name: "lead");

            migrationBuilder.DropTable(
                name: "master_services");

            migrationBuilder.DropTable(
                name: "notifications");

            migrationBuilder.DropTable(
                name: "salon_invitations");

            migrationBuilder.DropTable(
                name: "support_message");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "gift_cards");

            migrationBuilder.DropTable(
                name: "bookings");

            migrationBuilder.DropTable(
                name: "clients");

            migrationBuilder.DropTable(
                name: "masters");

            migrationBuilder.DropTable(
                name: "services");

            migrationBuilder.DropTable(
                name: "salons");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
