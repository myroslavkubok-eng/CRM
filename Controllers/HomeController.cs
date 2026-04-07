using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

/// <summary>
/// Serves all Razor Views that host the React SPA.
/// The SPA uses HashRouter so the server always returns the same index.html shell;
/// the React app handles routing client-side via the URL hash (#/...).
/// </summary>
public class HomeController : Controller
{
    [HttpGet("/")]
    [HttpGet("/home")]
    public IActionResult Index() => View("~/Views/Home/Index.cshtml");

    [HttpGet("/auth")]
    [HttpGet("/login")]
    public IActionResult Auth() => View("~/Views/Auth/Index.cshtml");

    [HttpGet("/pricing")]
    public IActionResult Pricing() => View("~/Views/Pricing/Index.cshtml");

    [HttpGet("/feed")]
    public IActionResult Feed() => View("~/Views/Feed/Index.cshtml");

    [HttpGet("/contact")]
    public IActionResult Contact() => View("~/Views/Contact/Index.cshtml");

    [HttpGet("/salons")]
    [HttpGet("/salon/listing")]
    public IActionResult SalonListing() => View("~/Views/Salon/Listing.cshtml");

    [HttpGet("/salon/{id?}")]
    [HttpGet("/salon/profile/{id?}")]
    public IActionResult SalonProfile(string? id) => View("~/Views/Salon/Profile.cshtml");

    [HttpGet("/book/{salonId?}")]
    [HttpGet("/salon/booking/{salonId?}")]
    public IActionResult Booking(string? salonId) => View("~/Views/Salon/Booking.cshtml");

    [HttpGet("/register")]
    [HttpGet("/salon/register")]
    public IActionResult SalonRegister() => View("~/Views/Salon/Register.cshtml");

    [HttpGet("/become-partner")]
    [HttpGet("/admin/become-partner")]
    public IActionResult BecomePartner() => View("~/Views/Admin/BecomePartner.cshtml");

    // Dashboard routes — authentication enforced by the React app (JWT)
    [HttpGet("/owner")]
    [HttpGet("/dashboard/owner")]
    public IActionResult OwnerDashboard() => View("~/Views/Dashboard/Owner.cshtml");

    [HttpGet("/admin")]
    [HttpGet("/dashboard/admin")]
    public IActionResult AdminDashboard() => View("~/Views/Dashboard/Admin.cshtml");

    [HttpGet("/master")]
    [HttpGet("/dashboard/master")]
    public IActionResult MasterDashboard() => View("~/Views/Dashboard/Master.cshtml");

    [HttpGet("/client")]
    [HttpGet("/dashboard/client")]
    public IActionResult ClientDashboard() => View("~/Views/Dashboard/Client.cshtml");

    [HttpGet("/superadmin")]
    [HttpGet("/superadmin/{**slug}")]
    [HttpGet("/dashboard/superadmin")]
    public IActionResult SuperAdminDashboard() => View("~/Views/Dashboard/SuperAdmin.cshtml");

    [HttpGet("/leads")]
    [HttpGet("/admin/leads")]
    public IActionResult Leads() => View("~/Views/Admin/Leads.cshtml");

    // Catch-all: any unmatched route returns home (SPA handles it via hash)
    [HttpGet("/redirect")]
    [HttpGet("/dashboard")]
    public IActionResult Redirect() => View("~/Views/Home/Index.cshtml");
}
