using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfrastructureData.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    NombreCompleto = table.Column<string>(type: "text", nullable: false),
                    Rol = table.Column<string>(type: "text", nullable: false),
                    Activo = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuditoriaLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    TipoAccion = table.Column<string>(type: "text", nullable: false),
                    EntidadTipo = table.Column<string>(type: "text", nullable: false),
                    EntidadId = table.Column<Guid>(type: "uuid", nullable: false),
                    CambiosAnteriores = table.Column<string>(type: "text", nullable: true),
                    CambiosNuevos = table.Column<string>(type: "text", nullable: true),
                    FechaAccion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DireccionIP = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditoriaLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AuditoriaLogs_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Infraestructuras",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    Tipo = table.Column<string>(type: "text", nullable: false),
                    Estado = table.Column<string>(type: "text", nullable: false),
                    Region = table.Column<string>(type: "text", nullable: false),
                    Latitud = table.Column<decimal>(type: "numeric(10,7)", precision: 10, scale: 7, nullable: false),
                    Longitud = table.Column<decimal>(type: "numeric(10,7)", precision: 10, scale: 7, nullable: false),
                    CapacidadMaxima = table.Column<int>(type: "integer", nullable: true),
                    CapacidadActual = table.Column<int>(type: "integer", nullable: true),
                    ResponsableId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Infraestructuras", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Infraestructuras_Usuarios_ResponsableId",
                        column: x => x.ResponsableId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Incidentes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InfrastructuraId = table.Column<Guid>(type: "uuid", nullable: false),
                    Titulo = table.Column<string>(type: "text", nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: false),
                    Severidad = table.Column<string>(type: "text", nullable: false),
                    Estado = table.Column<string>(type: "text", nullable: false),
                    FechaReporte = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AsignadoAId = table.Column<Guid>(type: "uuid", nullable: true),
                    FechaResolucion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    NotasResolucion = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Incidentes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Incidentes_Infraestructuras_InfrastructuraId",
                        column: x => x.InfrastructuraId,
                        principalTable: "Infraestructuras",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Incidentes_Usuarios_AsignadoAId",
                        column: x => x.AsignadoAId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditoriaLogs_UsuarioId_TipoAccion",
                table: "AuditoriaLogs",
                columns: new[] { "UsuarioId", "TipoAccion" });

            migrationBuilder.CreateIndex(
                name: "IX_Incidentes_AsignadoAId",
                table: "Incidentes",
                column: "AsignadoAId");

            migrationBuilder.CreateIndex(
                name: "IX_Incidentes_Estado_Severidad",
                table: "Incidentes",
                columns: new[] { "Estado", "Severidad" });

            migrationBuilder.CreateIndex(
                name: "IX_Incidentes_InfrastructuraId",
                table: "Incidentes",
                column: "InfrastructuraId");

            migrationBuilder.CreateIndex(
                name: "IX_Infraestructuras_Region_Estado",
                table: "Infraestructuras",
                columns: new[] { "Region", "Estado" });

            migrationBuilder.CreateIndex(
                name: "IX_Infraestructuras_ResponsableId",
                table: "Infraestructuras",
                column: "ResponsableId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditoriaLogs");

            migrationBuilder.DropTable(
                name: "Incidentes");

            migrationBuilder.DropTable(
                name: "Infraestructuras");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
