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
            await JSHost.ImportAsync("DetectHandsJsComponent/DetectHands", "../_content/DetectHandsJsComponent/DetectHands.razor.js");
            await Interop.OnInit(this);
        }

        //[SupportedOSPlatform("browser")]
        public partial class Interop
        {
            [DynamicDependency(DynamicallyAccessedMemberTypes.PublicMethods, typeof(JsonTypeInfo))]
            [DynamicDependency(DynamicallyAccessedMemberTypes.PublicMethods, typeof(JsonSerializerContext))]
            static Interop()
            {
            }

            [JSImport("onInit", "DetectHandsJsComponent/DetectHands")]
            internal static partial Task OnInit([JSMarshalAs<JSType.Any>] object component);

            [JSExport]
            internal static void OnResults([JSMarshalAs<JSType.Any>] object component, string json)
            {
                DetectHands detectHands = (DetectHands)component;
                detectHands.DetectionResult = JsonSerializer.Deserialize<DetectionResult>(json, DetectionResult.SerializeOptions);
                Console.WriteLine("OnResults " + detectHands.DetectionResult.Hands.Count);
                detectHands.StateHasChanged();
            }
        }
    }

    public record DetectionResult
    {
        internal static JsonSerializerOptions SerializeOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

        public List<Hand> Hands { get; set; }
    }

    public record Hand
    {
        public int Index { get; set; }
        public double Score { get; set; }
        public string Label { get; set; }
        public List<Landmark> Landmarks { get; set; }
    }

    public record Landmark
    {
        public double X { get; set; }
        public double Y { get; set; }
        public double Z { get; set; }
    }
}
