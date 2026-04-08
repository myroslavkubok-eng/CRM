using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRMKatia.Migrations
{
    /// <inheritdoc />
    public partial class AddNewEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "attendance",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    master_id = table.Column<Guid>(type: "uuid", nullable: false),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false),
                    date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    check_in = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    check_out = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    status = table.Column<string>(type: "text", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: true),
                    working_hours = table.Column<TimeSpan>(type: "interval", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_attendance", x => x.id);
                    table.ForeignKey(
                        name: "fk_attendance_master_master_id",
                        column: x => x.master_id,
                        principalTable: "masters",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_attendance_salon_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "loyalty_program",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false),
                    is_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    points_per_dollar = table.Column<int>(type: "integer", nullable: false),
                    points_to_redeem_dollar = table.Column<int>(type: "integer", nullable: false),
                    bonus_points_on_signup = table.Column<int>(type: "integer", nullable: false),
                    points_expiry_months = table.Column<int>(type: "integer", nullable: false),
                    minimum_points_to_redeem = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_loyalty_program", x => x.id);
                    table.ForeignKey(
                        name: "fk_loyalty_program_salon_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "product",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    category = table.Column<string>(type: "text", nullable: true),
                    brand = table.Column<string>(type: "text", nullable: true),
                    price = table.Column<decimal>(type: "numeric", nullable: false),
                    cost = table.Column<decimal>(type: "numeric", nullable: true),
                    stock = table.Column<int>(type: "integer", nullable: false),
                    sku = table.Column<string>(type: "text", nullable: true),
                    image = table.Column<string>(type: "text", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_product", x => x.id);
                    table.ForeignKey(
                        name: "fk_product_salon_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "referral_program",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false),
                    is_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    referrer_reward = table.Column<decimal>(type: "numeric", nullable: false),
                    referee_reward = table.Column<decimal>(type: "numeric", nullable: false),
                    minimum_purchase_for_reward = table.Column<decimal>(type: "numeric", nullable: false),
                    max_referrals_per_client = table.Column<int>(type: "integer", nullable: false),
                    reward_expiry_days = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_referral_program", x => x.id);
                    table.ForeignKey(
                        name: "fk_referral_program_salon_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "review",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false),
                    client_id = table.Column<Guid>(type: "uuid", nullable: true),
                    master_id = table.Column<Guid>(type: "uuid", nullable: true),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: true),
                    client_name = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: true),
                    comment = table.Column<string>(type: "text", nullable: true),
                    rating = table.Column<int>(type: "integer", nullable: false),
                    service_rating = table.Column<int>(type: "integer", nullable: true),
                    cleanliness_rating = table.Column<int>(type: "integer", nullable: true),
                    value_rating = table.Column<int>(type: "integer", nullable: true),
                    is_public = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_review", x => x.id);
                    table.ForeignKey(
                        name: "fk_review_booking_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_review_client_client_id",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_review_master_master_id",
                        column: x => x.master_id,
                        principalTable: "masters",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_review_salon_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "loyalty_point",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    client_id = table.Column<Guid>(type: "uuid", nullable: false),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false),
                    points = table.Column<int>(type: "integer", nullable: false),
                    reason = table.Column<string>(type: "text", nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    loyalty_program_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_loyalty_point", x => x.id);
                    table.ForeignKey(
                        name: "fk_loyalty_point_client_client_id",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_loyalty_point_loyalty_program_loyalty_program_id",
                        column: x => x.loyalty_program_id,
                        principalTable: "loyalty_program",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_loyalty_point_salon_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "referral",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    salon_id = table.Column<Guid>(type: "uuid", nullable: false),
                    referrer_id = table.Column<Guid>(type: "uuid", nullable: false),
                    referee_id = table.Column<Guid>(type: "uuid", nullable: false),
                    referrer_reward = table.Column<decimal>(type: "numeric", nullable: false),
                    referee_reward = table.Column<decimal>(type: "numeric", nullable: false),
                    is_referrer_reward_claimed = table.Column<bool>(type: "boolean", nullable: false),
                    is_referee_reward_claimed = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    referral_program_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_referral", x => x.id);
                    table.ForeignKey(
                        name: "fk_referral_client_referee_id",
                        column: x => x.referee_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_referral_client_referrer_id",
                        column: x => x.referrer_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_referral_referral_program_referral_program_id",
                        column: x => x.referral_program_id,
                        principalTable: "referral_program",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_referral_salon_salon_id",
                        column: x => x.salon_id,
                        principalTable: "salons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_attendance_master_id",
                table: "attendance",
                column: "master_id");

            migrationBuilder.CreateIndex(
                name: "ix_attendance_salon_id",
                table: "attendance",
                column: "salon_id");

            migrationBuilder.CreateIndex(
                name: "ix_loyalty_point_client_id",
                table: "loyalty_point",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "ix_loyalty_point_loyalty_program_id",
                table: "loyalty_point",
                column: "loyalty_program_id");

            migrationBuilder.CreateIndex(
                name: "ix_loyalty_point_salon_id",
                table: "loyalty_point",
                column: "salon_id");

            migrationBuilder.CreateIndex(
                name: "ix_loyalty_program_salon_id",
                table: "loyalty_program",
                column: "salon_id");

            migrationBuilder.CreateIndex(
                name: "ix_product_salon_id",
                table: "product",
                column: "salon_id");

            migrationBuilder.CreateIndex(
                name: "ix_referral_referee_id",
                table: "referral",
                column: "referee_id");

            migrationBuilder.CreateIndex(
                name: "ix_referral_referral_program_id",
                table: "referral",
                column: "referral_program_id");

            migrationBuilder.CreateIndex(
                name: "ix_referral_referrer_id",
                table: "referral",
                column: "referrer_id");

            migrationBuilder.CreateIndex(
                name: "ix_referral_salon_id",
                table: "referral",
                column: "salon_id");

            migrationBuilder.CreateIndex(
                name: "ix_referral_program_salon_id",
                table: "referral_program",
                column: "salon_id");

            migrationBuilder.CreateIndex(
                name: "ix_review_booking_id",
                table: "review",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "ix_review_client_id",
                table: "review",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "ix_review_master_id",
                table: "review",
                column: "master_id");

            migrationBuilder.CreateIndex(
                name: "ix_review_salon_id",
                table: "review",
                column: "salon_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "attendance");

            migrationBuilder.DropTable(
                name: "loyalty_point");

            migrationBuilder.DropTable(
                name: "product");

            migrationBuilder.DropTable(
                name: "referral");

            migrationBuilder.DropTable(
                name: "review");

            migrationBuilder.DropTable(
                name: "loyalty_program");

            migrationBuilder.DropTable(
                name: "referral_program");
        }
    }
}
