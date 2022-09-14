using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.InteropServices.JavaScript;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using System.Diagnostics.CodeAnalysis;

namespace DetectHandsJsComponent
{
    public partial class DetectHands
    {
        protected override async Task OnInitializedAsync()
        {
            await JSHost.ImportAsync("DetectHandsJsComponent/DetectHands", "/_content/DetectHandsJsComponent/DetectHands.razor.js");
            await Interop.OnInit();
        }

        public partial class Interop
        {
            [DynamicDependency(DynamicallyAccessedMemberTypes.PublicMethods, typeof(JsonTypeInfo))]
            [DynamicDependency(DynamicallyAccessedMemberTypes.PublicMethods, typeof(JsonSerializerContext))]
            static Interop()
            {
            }

            [JSImport("onInit", "DetectHandsJsComponent/DetectHands")]
            internal static partial Task OnInit();

            [JSExport]
            internal static void OnResults(string json)
            {
                Console.WriteLine("OnResults");
                //return JsonSerializer.Deserialize<List<Item>>(json) ?? new List<Item>();
            }
        }
    }
}
