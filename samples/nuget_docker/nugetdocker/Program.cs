using System;

namespace nugetdocker
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length != 2)
            {
                Console.Error.WriteLine("Usage: product x y");
                return;
            }

            int val = new mymathlib().Multiply(int.Parse(args[0]), int.Parse(args[1]));
            Console.WriteLine("Product: {0}.", val);
        }
    }
}
