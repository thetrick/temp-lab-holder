using nugetdocker;
using NUnit.Framework;

namespace nugetdockerlib
{
    [TestFixture]
    public class Tests
    {
        [Test]
        public void ProductTest1()
        {
            Assert.AreEqual(100, new mymathlib().Multiply(10, 10));
        }

        //[Test]
        //public void ProductTest2()
        //{
        //    Assert.AreEqual(100, new mymathlib().Multiply(-10, -10));
        //}
    }
}
